import mongoose from 'mongoose';

const packagingOptionSchema = new mongoose.Schema({
  weight: {
    type: String,
    required: true,
    trim: true // e.g., '200g', '400g', '1kg', '5kg Bulk Carton'
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  discountPrice: {
    type: Number,
    min: 0,
    default: null
  },
  stock: {
    type: Number,
    default: 100,
    min: 0
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  sku: {
    type: String,
    trim: true,
    default: ''
  }
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [150, 'Product name cannot exceed 150 characters']
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required']
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      trim: true,
      maxlength: [300, 'Short description cannot exceed 300 characters']
    },
    fullDescription: {
      type: String,
      trim: true,
      default: ''
    },
    images: {
      type: [String],
      default: ['/assets/placeholders/sample-product.svg'],
      validate: {
        validator: function (val) {
          return val && val.length > 0;
        },
        message: 'At least one product image or placeholder is required'
      }
    },
    packagingOptions: {
      type: [packagingOptionSchema],
      required: true,
      validate: {
        validator: function (val) {
          return val && val.length > 0;
        },
        message: 'At least one packaging size/option is required'
      }
    },
    wholesaleInfo: {
      minOrderQty: {
        type: String,
        default: '5 kg'
      },
      wholesalePrice: {
        type: String,
        default: 'Contact for wholesale quote'
      },
      packagingType: {
        type: String,
        default: 'Carton Box / Food Grade Polybag'
      },
      notes: {
        type: String,
        default: ''
      }
    },
    ingredients: {
      type: [String],
      default: []
    },
    shelfLife: {
      type: String,
      default: '4 Months from manufacturing'
    },
    storageInstructions: {
      type: String,
      default: 'Store in a cool, dry place away from direct sunlight in an airtight container.'
    },
    dietaryInfo: {
      isVegetarian: {
        type: Boolean,
        default: true
      },
      spiceLevel: {
        type: String,
        enum: ['Mild', 'Medium', 'Spicy', 'Sweet & Savory', 'Sweet'],
        default: 'Medium'
      }
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    displayOrder: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Virtual for base display price (from default or first packaging option)
productSchema.virtual('basePrice').get(function () {
  if (!this.packagingOptions || this.packagingOptions.length === 0) return 0;
  const def = this.packagingOptions.find((p) => p.isDefault);
  return def ? def.price : this.packagingOptions[0].price;
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

export const Product = mongoose.model('Product', productSchema);
