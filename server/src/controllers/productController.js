import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

// @desc    Get all products with filtering & search
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const { category, search, featured, available, sort } = req.query;

    const filter = {};

    // Filter by availability for public users
    if (available !== undefined) {
      filter.isAvailable = available === 'true';
    } else if (req.query.adminView !== 'true') {
      filter.isAvailable = true;
    }

    // Filter by featured
    if (featured === 'true') {
      filter.isFeatured = true;
    }

    // Filter by category slug or ObjectId
    if (category && category !== 'all') {
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        filter.category = category;
      } else {
        const cat = await Category.findOne({ slug: category });
        if (cat) {
          filter.category = cat._id;
        } else {
          return res.status(200).json({ success: true, count: 0, products: [] });
        }
      }
    }

    // Search by name or ingredients
    if (search && search.trim()) {
      const keyword = search.trim();
      filter.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { shortDescription: { $regex: keyword, $options: 'i' } },
        { ingredients: { $regex: keyword, $options: 'i' } }
      ];
    }

    // Sorting
    let sortQuery = { displayOrder: 1, createdAt: -1 };
    if (sort === 'price-low') {
      sortQuery = { 'packagingOptions.0.price': 1 };
    } else if (sort === 'price-high') {
      sortQuery = { 'packagingOptions.0.price': -1 };
    } else if (sort === 'name-asc') {
      sortQuery = { name: 1 };
    } else if (sort === 'newest') {
      sortQuery = { createdAt: -1 };
    }

    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .sort(sortQuery);

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by slug or id
// @route   GET /api/products/:slugOrId
// @access  Public
export const getProduct = async (req, res, next) => {
  try {
    const { slugOrId } = req.params;
    let product;

    if (slugOrId.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(slugOrId).populate('category', 'name slug');
    } else {
      product = await Product.findOne({ slug: slugOrId }).populate('category', 'name slug');
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private (Admin)
export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      category,
      shortDescription,
      fullDescription,
      images,
      packagingOptions,
      wholesaleInfo,
      ingredients,
      shelfLife,
      storageInstructions,
      dietaryInfo,
      isFeatured,
      isAvailable,
      displayOrder
    } = req.body;

    if (!name || !category || !shortDescription) {
      return res.status(400).json({
        success: false,
        message: 'Name, category, and short description are required.'
      });
    }

    // Verify category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: 'Selected category does not exist.'
      });
    }

    // Generate unique slug
    let baseSlug = slugify(name);
    let uniqueSlug = baseSlug;
    let counter = 1;
    while (await Product.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Default packaging if none provided
    const packs =
      packagingOptions && packagingOptions.length > 0
        ? packagingOptions
        : [
            { weight: '200g', price: 60, stock: 100, isDefault: true },
            { weight: '400g', price: 110, stock: 80, isDefault: false },
            { weight: '1kg', price: 260, stock: 50, isDefault: false }
          ];

    // Ensure at least one option is set as default
    if (!packs.some((p) => p.isDefault)) {
      packs[0].isDefault = true;
    }

    const productImages =
      images && images.length > 0
        ? images
        : ['/assets/placeholders/sample-product.svg'];

    const product = await Product.create({
      name: name.trim(),
      slug: uniqueSlug,
      category,
      shortDescription: shortDescription.trim(),
      fullDescription: fullDescription ? fullDescription.trim() : '',
      images: productImages,
      packagingOptions: packs,
      wholesaleInfo: wholesaleInfo || {
        minOrderQty: '5 kg',
        wholesalePrice: 'Contact for wholesale quote',
        packagingType: 'Carton Box / Food Grade Polybag'
      },
      ingredients: Array.isArray(ingredients) ? ingredients : [],
      shelfLife: shelfLife || '4 Months from manufacturing',
      storageInstructions: storageInstructions || 'Store in a cool, dry place in an airtight container.',
      dietaryInfo: dietaryInfo || { isVegetarian: true, spiceLevel: 'Medium' },
      isFeatured: !!isFeatured,
      isAvailable: isAvailable !== undefined ? !!isAvailable : true,
      displayOrder: Number(displayOrder) || 0
    });

    const populated = await Product.findById(product._id).populate('category', 'name slug');

    res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      product: populated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Admin)
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    const {
      name,
      category,
      shortDescription,
      fullDescription,
      images,
      packagingOptions,
      wholesaleInfo,
      ingredients,
      shelfLife,
      storageInstructions,
      dietaryInfo,
      isFeatured,
      isAvailable,
      displayOrder
    } = req.body;

    if (name && name.trim() !== product.name) {
      product.name = name.trim();
      let baseSlug = slugify(name);
      let uniqueSlug = baseSlug;
      let counter = 1;
      while (
        await Product.findOne({ slug: uniqueSlug, _id: { $ne: product._id } })
      ) {
        uniqueSlug = `${baseSlug}-${counter}`;
        counter++;
      }
      product.slug = uniqueSlug;
    }

    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: 'Selected category does not exist.'
        });
      }
      product.category = category;
    }

    if (shortDescription !== undefined) product.shortDescription = shortDescription.trim();
    if (fullDescription !== undefined) product.fullDescription = fullDescription.trim();
    if (images && images.length > 0) product.images = images;
    if (packagingOptions && packagingOptions.length > 0) {
      // Ensure one is default
      if (!packagingOptions.some((p) => p.isDefault)) {
        packagingOptions[0].isDefault = true;
      }
      product.packagingOptions = packagingOptions;
    }
    if (wholesaleInfo) product.wholesaleInfo = wholesaleInfo;
    if (ingredients !== undefined) product.ingredients = Array.isArray(ingredients) ? ingredients : [];
    if (shelfLife !== undefined) product.shelfLife = shelfLife;
    if (storageInstructions !== undefined) product.storageInstructions = storageInstructions;
    if (dietaryInfo) product.dietaryInfo = dietaryInfo;
    if (isFeatured !== undefined) product.isFeatured = isFeatured;
    if (isAvailable !== undefined) product.isAvailable = isAvailable;
    if (displayOrder !== undefined) product.displayOrder = Number(displayOrder);

    await product.save();
    const updated = await Product.findById(product._id).populate('category', 'name slug');

    res.status(200).json({
      success: true,
      message: 'Product updated successfully.',
      product: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Admin)
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle featured status
// @route   PATCH /api/products/:id/feature
// @access  Private (Admin)
export const toggleFeatured = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    product.isFeatured = !product.isFeatured;
    await product.save();

    res.status(200).json({
      success: true,
      message: `Product marked as ${product.isFeatured ? 'featured' : 'standard'}.`,
      isFeatured: product.isFeatured
    });
  } catch (error) {
    next(error);
  }
};
