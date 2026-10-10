import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    originalName: {
      type: String,
      default: ''
    },
    contentType: {
      type: String,
      required: true,
      default: 'image/jpeg'
    },
    data: {
      type: String, // Base64 data string
      required: true
    },
    size: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

export const Media = mongoose.model('Media', mediaSchema);
