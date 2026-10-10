import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { Admin } from '../models/Admin.js';
import { Category } from '../models/Category.js';
import { Product } from '../models/Product.js';
import { Setting } from '../models/Setting.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../server/.env') });

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/shriji_namkeen';
    console.log(`[Seed] Connecting to: ${mongoUri}`);
    await mongoose.connect(mongoUri);

    console.log('[Seed] Checking Administrator...');
    const adminEmail = process.env.ADMIN_DEFAULT_EMAIL || 'admin@shrijinamkeen.com';
    const existingAdmin = await Admin.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await Admin.create({
        name: process.env.ADMIN_DEFAULT_NAME || 'Shriji Management',
        email: adminEmail,
        password: process.env.ADMIN_DEFAULT_PASSWORD || 'Admin@Shriji123',
        role: 'admin'
      });
      console.log(`[Seed] Created default admin: ${adminEmail}`);
    } else {
      console.log(`[Seed] Admin already exists: ${adminEmail}`);
    }

    console.log('[Seed] Checking Business Settings...');
    const existingSettings = await Setting.findOne();
    if (!existingSettings) {
      await Setting.create({
        businessName: 'SHRIJI NAMKEEN',
        businessType: 'Namkeen manufacturing, retail, and wholesale',
        tagline: 'Authentic Indian Taste & Fresh Savouries',
        whatsappNumber: '+91 63931 01490',
        phoneNumber: '+91 63931 01490',
        email: 'contact@shrijinamkeen.com',
        address: 'Near Police Booth, Sarimeer, Azamgarh, Uttar Pradesh 276305, India',
        landmark: 'Near Police Booth',
        city: 'Sarimeer, Azamgarh',
        state: 'Uttar Pradesh',
        pincode: '276305',
        country: 'India',
        currency: '₹',
        businessHours: 'Monday to Sunday: 8:00 AM - 9:00 PM',
        announcementText: 'Welcome to SHRIJI NAMKEEN! Direct wholesale & retail orders available. Fresh batches made daily.',
        isAnnouncementActive: true,
        wholesaleNotice: 'Direct factory pricing for retail shops, event caterers, sweet marts, and distributors across Uttar Pradesh and India.',
        minimumWholesaleOrder: 'Minimum ₹3,000 for wholesale rate discounts',
        aboutStory: 'SHRIJI NAMKEEN is a trusted namkeen manufacturing and wholesale enterprise located in Sarimeer, Azamgarh (U.P.). With a commitment to purity, authentic culinary traditions, and uncompromising hygienic standards, we produce fresh, crunchy savouries that bring authentic taste to tea tables and festive gatherings.'
      });
      console.log('[Seed] Created default business settings.');
    } else {
      console.log('[Seed] Business settings already initialized.');
    }

    console.log('[Seed] Checking Categories...');
    const categoriesData = [
      { name: 'Traditional Mixtures', slug: 'traditional-mixtures', description: 'Classic and royal dry fruit spiced mixtures', displayOrder: 1 },
      { name: 'Crunchy Snacks & Kurkure', slug: 'crunchy-snacks-kurkure', description: 'Crispy extruded corn and potato masala sticks', displayOrder: 2 },
      { name: 'Classic Sev & Bhujia', slug: 'classic-sev-bhujia', description: 'Fine spiced besan sev, bhujia, and ratlami blends', displayOrder: 3 },
      { name: 'Festive Sweets & Specials', slug: 'festive-sweets-specials', description: 'Pure desi ghee sweets and celebratory specials', displayOrder: 4 },
      { name: 'Wholesale & Bulk Cartons', slug: 'wholesale-bulk-cartons', description: 'Master packaging cartons for distributors & retail stores', displayOrder: 5 }
    ];

    const categoryMap = {};
    for (const cat of categoriesData) {
      let doc = await Category.findOne({ slug: cat.slug });
      if (!doc) {
        doc = await Category.create(cat);
        console.log(`[Seed] Created category: ${cat.name}`);
      }
      categoryMap[cat.slug] = doc._id;
    }

    console.log('[Seed] Checking Products...');
    const productsData = [
      {
        name: 'Navratan Royal Dry Fruit Mixture',
        slug: 'navratan-royal-dry-fruit-mixture',
        category: categoryMap['traditional-mixtures'],
        shortDescription: 'A rich, royal festive mixture loaded with crunchy cashews, roasted peanuts, crisp green peas, and traditional spicy gram flour sev.',
        fullDescription: 'Handcrafted in Sarimeer using authentic Azamgarh family spice blends, Shriji\'s Navratan Royal Dry Fruit Mixture is the crown jewel of tea-time snacking. Packed with premium cashews, handpicked peanuts, crunchy sev, and puffed rice crisps, each bite delivers an irresistible savoury crunch with balanced warmth.',
        images: ['/assets/products/navratan-mixture.jpg'],
        packagingOptions: [
          { weight: '200g', price: 75, discountPrice: 70, stock: 120, isDefault: true },
          { weight: '400g', price: 145, discountPrice: 135, stock: 80, isDefault: false },
          { weight: '1kg', price: 340, discountPrice: 320, stock: 45, isDefault: false }
        ],
        wholesaleInfo: {
          minOrderQty: '5 kg',
          wholesalePrice: '₹260/kg in bulk orders',
          packagingType: '5kg Sealed Food Grade Polybag / 20kg Master Carton',
          notes: 'Special discounts on 50kg+ consignments.'
        },
        ingredients: ['Gram Flour (Besan)', 'Cashews', 'Peanuts', 'Green Peas', 'Puffed Rice', 'Pure Edible Oil', 'Black Salt', 'Chaat Masala', 'Traditional Spices'],
        shelfLife: '4 Months from manufacturing',
        dietaryInfo: { isVegetarian: true, spiceLevel: 'Medium' },
        isFeatured: true,
        displayOrder: 1
      },
      {
        name: 'Chatpata Masala Kurkure Sticks',
        slug: 'chatpata-masala-kurkure-sticks',
        category: categoryMap['crunchy-snacks-kurkure'],
        shortDescription: 'Super crispy spiral corn and grain sticks tossed in zesty, tangy north-Indian masala spices.',
        fullDescription: 'A favourite across all ages! Shriji\'s Chatpata Masala Kurkure Sticks are freshly extruded and fried to golden perfection, then tumbled in our signature red chilli and amchur masala mix. Maximum crunch with every single bite.',
        images: ['/assets/products/masala-kurkure.jpg'],
        packagingOptions: [
          { weight: '200g', price: 45, discountPrice: 40, stock: 150, isDefault: true },
          { weight: '400g', price: 85, discountPrice: 75, stock: 100, isDefault: false },
          { weight: '1kg', price: 200, discountPrice: 180, stock: 60, isDefault: false }
        ],
        wholesaleInfo: {
          minOrderQty: '10 kg',
          wholesalePrice: '₹140/kg in bulk cartons',
          packagingType: 'Carton of 40 pouches / 10kg Master pack',
          notes: 'High demand retail item for grocery shops and pan shops.'
        },
        ingredients: ['Corn Meal', 'Rice Flour', 'Gram Flour', 'Refined Vegetable Oil', 'Red Chilli', 'Amchur Powder', 'Coriander', 'Cumin', 'Iodised Salt'],
        shelfLife: '3 Months from manufacturing',
        dietaryInfo: { isVegetarian: true, spiceLevel: 'Spicy' },
        isFeatured: true,
        displayOrder: 2
      },
      {
        name: 'Khatta Meetha Special Mixture',
        slug: 'khatta-meetha-special-mixture',
        category: categoryMap['traditional-mixtures'],
        shortDescription: 'The iconic sweet and sour snacking delight made with crispy sev, roasted chana dal, golden boondi, and sweet raisins.',
        fullDescription: 'Our Khatta Meetha Special Mixture balances tangy mango seasoning with subtle sweetness. Crisp gram flour sev, golden boondi, roasted chana dal, and sweet raisins combine into a light, addictive tea-time companion.',
        images: ['/assets/products/khatta-meetha.jpg'],
        packagingOptions: [
          { weight: '250g', price: 65, discountPrice: 60, stock: 140, isDefault: true },
          { weight: '500g', price: 125, discountPrice: 115, stock: 90, isDefault: false },
          { weight: '1kg', price: 240, discountPrice: 220, stock: 50, isDefault: false }
        ],
        wholesaleInfo: {
          minOrderQty: '5 kg',
          wholesalePrice: '₹180/kg wholesale bulk',
          packagingType: '10kg & 20kg food-grade bulk bags',
          notes: 'Ideal for tea stalls, festive hampers, and grocery retail.'
        },
        ingredients: ['Besan (Gram Flour)', 'Puffed Rice', 'Chana Dal', 'Raisins', 'Edible Vegetable Oil', 'Sugar', 'Dry Mango Powder', 'Hing', 'Turmeric', 'Rock Salt'],
        shelfLife: '4 Months from manufacturing',
        dietaryInfo: { isVegetarian: true, spiceLevel: 'Sweet & Savory' },
        isFeatured: true,
        displayOrder: 3
      },
      {
        name: 'Shahi Desi Ghee Soan Papdi',
        slug: 'shahi-desi-ghee-soan-papdi',
        category: categoryMap['festive-sweets-specials'],
        shortDescription: 'Delicate, flaky, melt-in-mouth traditional sweet enriched with pure desi ghee, fragrant cardamom, almonds, and pistachios.',
        fullDescription: 'Prepared following timeless confectionary techniques in Sarimeer, Shriji Shahi Soan Papdi offers unmatched fine flaky texture. Gently infused with cardamom and topped with crunchy slivered almonds and pistachios, it makes the perfect gift for every festival, wedding, and celebration.',
        images: ['/assets/products/soan-papdi.jpg'],
        packagingOptions: [
          { weight: '250g', price: 95, discountPrice: 90, stock: 80, isDefault: true },
          { weight: '500g', price: 180, discountPrice: 170, stock: 60, isDefault: false },
          { weight: '1kg', price: 350, discountPrice: 330, stock: 35, isDefault: false }
        ],
        wholesaleInfo: {
          minOrderQty: '10 kg (20 Boxes)',
          wholesalePrice: '₹280/kg wholesale',
          packagingType: 'Individually boxed festive cartons (24 boxes/master carton)',
          notes: 'Custom packaging available for Diwali, Eid, and wedding orders.'
        },
        ingredients: ['Gram Flour (Besan)', 'Fine Wheat Flour', 'Pure Desi Ghee', 'Sugar', 'Almonds', 'Pistachios', 'Cardamom'],
        shelfLife: '3 Months from manufacturing',
        dietaryInfo: { isVegetarian: true, spiceLevel: 'Sweet' },
        isFeatured: true,
        displayOrder: 4
      },
      {
        name: 'Spicy Ratlami Sev',
        slug: 'spicy-ratlami-sev',
        category: categoryMap['classic-sev-bhujia'],
        shortDescription: 'Authentic thick gram flour sev boldly spiced with freshly crushed cloves, black pepper, and ajwain.',
        fullDescription: 'For lovers of true Indian spice! Our Ratlami Sev delivers the iconic punch of laung (cloves) and kali mirch (black pepper) blended into crispy besan sev. Excellent on its own or sprinkled over poha, chaat, and curries.',
        images: ['/assets/placeholders/sample-product.svg'],
        packagingOptions: [
          { weight: '200g', price: 55, discountPrice: 50, stock: 110, isDefault: true },
          { weight: '400g', price: 105, discountPrice: 95, stock: 70, isDefault: false },
          { weight: '1kg', price: 250, discountPrice: 230, stock: 40, isDefault: false }
        ],
        wholesaleInfo: {
          minOrderQty: '5 kg',
          wholesalePrice: '₹190/kg wholesale',
          packagingType: '5kg polybags & 20kg master cartons',
          notes: 'Staple product for morning breakfast vendors and snack shops.'
        },
        ingredients: ['Gram Flour', 'Pure Vegetable Oil', 'Cloves', 'Black Pepper', 'Ajwain', 'Asafoetida (Hing)', 'Salt'],
        shelfLife: '4 Months from manufacturing',
        dietaryInfo: { isVegetarian: true, spiceLevel: 'Spicy' },
        isFeatured: false,
        displayOrder: 5
      },
      {
        name: 'Royal Bikaneri Bhujia',
        slug: 'royal-bikaneri-bhujia',
        category: categoryMap['classic-sev-bhujia'],
        shortDescription: 'Delicately crisp moth dal and besan bhujia scented with hing and ground spices.',
        fullDescription: 'A classic North Indian staple! Fine, crispy noodles of moth bean flour and chickpea flour with a fragrant hint of hing and red chilli.',
        images: ['/assets/placeholders/sample-product.svg'],
        packagingOptions: [
          { weight: '200g', price: 55, discountPrice: 50, stock: 130, isDefault: true },
          { weight: '400g', price: 105, discountPrice: 95, stock: 80, isDefault: false },
          { weight: '1kg', price: 250, discountPrice: 230, stock: 50, isDefault: false }
        ],
        wholesaleInfo: {
          minOrderQty: '5 kg',
          wholesalePrice: '₹190/kg wholesale',
          packagingType: '15kg bulk containers / 200g master cartons',
          notes: 'Consistently high re-order volume.'
        },
        ingredients: ['Moth Dal Flour', 'Gram Flour', 'Edible Vegetable Oil', 'Hing', 'Red Chilli Powder', 'Salt'],
        shelfLife: '4 Months from manufacturing',
        dietaryInfo: { isVegetarian: true, spiceLevel: 'Medium' },
        isFeatured: false,
        displayOrder: 6
      },
      {
        name: 'Wholesale Commercial Carton (Mix 20kg)',
        slug: 'wholesale-commercial-carton-mix-20kg',
        category: categoryMap['wholesale-bulk-cartons'],
        shortDescription: 'Factory direct wholesale carton containing assorted best-selling namkeens for retail grocery stores and event caterers.',
        fullDescription: 'Direct wholesale package straight from our manufacturing facility in Sarimeer, Azamgarh. Tailored for retail shop owners, supermarket distributors, and caterers. Includes an assortment of our bestselling mixtures, sev, and snacks packaged in sealed tamper-proof bulk units.',
        images: ['/assets/placeholders/sample-product.svg'],
        packagingOptions: [
          { weight: '20kg Master Carton', price: 3800, discountPrice: 3600, stock: 30, isDefault: true },
          { weight: '50kg Master Consignment', price: 9200, discountPrice: 8750, stock: 15, isDefault: false }
        ],
        wholesaleInfo: {
          minOrderQty: '1 Master Carton (20kg)',
          wholesalePrice: '₹180/kg effective blended rate',
          packagingType: 'Heavy 5-ply corrugated carton with inner airtight moisture seal',
          notes: 'Freight assistance available for Azamgarh, Mau, Jaunpur, and Varanasi districts.'
        },
        ingredients: ['Assorted authentic Shriji namkeens and savouries'],
        shelfLife: '4 Months from manufacturing',
        dietaryInfo: { isVegetarian: true, spiceLevel: 'Medium' },
        isFeatured: true,
        displayOrder: 7
      }
    ];

    for (const prod of productsData) {
      const exists = await Product.findOne({ slug: prod.slug });
      if (!exists) {
        await Product.create(prod);
        console.log(`[Seed] Created product: ${prod.name}`);
      } else {
        // Update images if currently using placeholder or to ensure authentic photos are linked
        if (prod.images && prod.images.length > 0) {
          exists.images = prod.images;
          await exists.save();
        }
      }
    }

    console.log('[Seed] Database seeding completed successfully.');
    if (process.argv[1] && process.argv[1].includes('seed.js')) {
      process.exit(0);
    }
  } catch (err) {
    console.error('[Seed] Error during seeding:', err);
    if (process.argv[1] && process.argv[1].includes('seed.js')) {
      process.exit(1);
    }
  }
};

export default seedDatabase;

if (process.argv[1] && process.argv[1].includes('seed.js')) {
  seedDatabase();
}
