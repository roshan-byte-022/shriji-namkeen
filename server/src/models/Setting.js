import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      default: 'SHRIJI NAMKEEN'
    },
    tagline: {
      type: String,
      default: 'Authentic Indian Taste & Fresh Savouries'
    },
    businessType: {
      type: String,
      default: 'Namkeen manufacturing, retail, and wholesale'
    },
    whatsappNumber: {
      type: String,
      default: '+91 63931 01490'
    },
    phoneNumber: {
      type: String,
      default: '+91 63931 01490'
    },
    alternatePhone: {
      type: String,
      default: ''
    },
    email: {
      type: String,
      default: 'info@shrijinamkeen.com'
    },
    address: {
      type: String,
      default: 'Near Police Booth, Sarimeer, Azamgarh, Uttar Pradesh 276305, India'
    },
    landmark: {
      type: String,
      default: 'Near Police Booth'
    },
    city: {
      type: String,
      default: 'Sarimeer, Azamgarh'
    },
    state: {
      type: String,
      default: 'Uttar Pradesh'
    },
    pincode: {
      type: String,
      default: '276305'
    },
    country: {
      type: String,
      default: 'India'
    },
    currency: {
      type: String,
      default: '₹'
    },
    businessHours: {
      type: String,
      default: 'Monday to Sunday: 8:00 AM - 9:00 PM'
    },
    announcementText: {
      type: String,
      default: 'Welcome to SHRIJI NAMKEEN! Fresh batches made daily. Direct wholesale & retail orders available.'
    },
    isAnnouncementActive: {
      type: Boolean,
      default: true
    },
    wholesaleNotice: {
      type: String,
      default: 'Special wholesale rates for grocery stores, sweet shops, wedding caterers, and bulk distributors.'
    },
    minimumWholesaleOrder: {
      type: String,
      default: 'Minimum ₹3,000 for wholesale pricing'
    },
    aboutStory: {
      type: String,
      default: 'SHRIJI NAMKEEN is a premier namkeen and savoury manufacturer based in Sarimeer, Azamgarh (Uttar Pradesh). Rooted in traditional recipes and authentic spices, we take pride in preparing freshly fried and roasted namkeens with 100% pure ingredients, zero adulteration, and top hygienic standards. Serving retail snack lovers and wholesale distributors with unmatched crispness and taste.'
    },
    upiId: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

export const Setting = mongoose.model('Setting', settingSchema);
