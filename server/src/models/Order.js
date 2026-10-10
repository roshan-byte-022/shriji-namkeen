import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  productName: {
    type: String,
    required: true
  },
  productImage: {
    type: String,
    default: ''
  },
  weight: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  }
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    whatsappNumber: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: ''
    },
    orderType: {
      type: String,
      enum: ['retail_order', 'wholesale_inquiry', 'custom_inquiry'],
      default: 'retail_order'
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      default: 0
    },
    businessName: {
      type: String,
      trim: true,
      default: ''
    },
    deliveryAddress: {
      addressLine: { type: String, trim: true, default: '' },
      city: { type: String, trim: true, default: '' },
      state: { type: String, trim: true, default: 'Uttar Pradesh' },
      pincode: { type: String, trim: true, default: '' }
    },
    customerNotes: {
      type: String,
      trim: true,
      default: ''
    },
    status: {
      type: String,
      enum: ['pending', 'contacted', 'confirmed', 'dispatched', 'delivered', 'cancelled'],
      default: 'pending'
    },
    internalNotes: {
      type: String,
      trim: true,
      default: ''
    },
    source: {
      type: String,
      enum: ['website_form', 'whatsapp_checkout', 'manual_admin'],
      default: 'website_form'
    }
  },
  {
    timestamps: true
  }
);

export const Order = mongoose.model('Order', orderSchema);
