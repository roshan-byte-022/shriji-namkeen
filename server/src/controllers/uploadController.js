import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.resolve(__dirname, '../../uploads');

// @desc    Upload single image
// @route   POST /api/upload
// @access  Private (Admin)
export const uploadSingleImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded. Please select an image.'
    });
  }

  const fileUrl = `/uploads/${req.file.filename}`;

  res.status(200).json({
    success: true,
    message: 'Image uploaded successfully.',
    url: fileUrl,
    filename: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size
  });
};

// @desc    Upload multiple images
// @route   POST /api/upload/multiple
// @access  Private (Admin)
export const uploadMultipleImages = (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No files uploaded.'
    });
  }

  const files = req.files.map((file) => ({
    url: `/uploads/${file.filename}`,
    filename: file.filename,
    originalName: file.originalname,
    size: file.size
  }));

  res.status(200).json({
    success: true,
    message: `${files.length} image(s) uploaded successfully.`,
    files,
    urls: files.map((f) => f.url)
  });
};

// @desc    Delete uploaded image file
// @route   DELETE /api/upload/:filename
// @access  Private (Admin)
export const deleteUploadedImage = (req, res) => {
  const { filename } = req.params;

  // Sanitize filename to prevent directory traversal
  const safeFilename = path.basename(filename);
  const filePath = path.join(uploadDir, safeFilename);

  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      return res.status(200).json({
        success: true,
        message: 'Image file deleted successfully.'
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete file from disk.'
      });
    }
  } else {
    // If not found in uploads, might be in static client assets or already removed
    return res.status(200).json({
      success: true,
      message: 'Image removed from reference.'
    });
  }
};
