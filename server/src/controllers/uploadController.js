import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { Media } from '../models/Media.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.resolve(__dirname, '../../uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// @desc    Upload single image (persists to disk AND MongoDB Media collection)
// @route   POST /api/upload
// @access  Private (Admin)
export const uploadSingleImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded. Please select an image.'
    });
  }

  const filename = req.file.filename;
  const fileUrl = `/uploads/${filename}`;

  try {
    // Read file buffer from disk to store permanently in MongoDB Atlas
    const diskPath = path.join(uploadDir, filename);
    let base64Data = '';
    if (fs.existsSync(diskPath)) {
      const buffer = fs.readFileSync(diskPath);
      base64Data = buffer.toString('base64');
    }

    // Persist in MongoDB so images are NEVER lost on Render free tier restarts
    if (base64Data) {
      await Media.findOneAndUpdate(
        { filename },
        {
          filename,
          originalName: req.file.originalname,
          contentType: req.file.mimetype || 'image/jpeg',
          data: base64Data,
          size: req.file.size
        },
        { upsert: true, new: true }
      );
    }

    return res.status(200).json({
      success: true,
      message: 'Image uploaded successfully.',
      url: fileUrl,
      filename: filename,
      originalName: req.file.originalname,
      size: req.file.size
    });
  } catch (err) {
    console.error('[Upload Controller Error]:', err);
    // Still return the local file URL if disk succeeded
    return res.status(200).json({
      success: true,
      message: 'Image uploaded to local storage.',
      url: fileUrl,
      filename: filename
    });
  }
};

// @desc    Upload multiple images
// @route   POST /api/upload/multiple
// @access  Private (Admin)
export const uploadMultipleImages = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No files uploaded.'
    });
  }

  const savedFiles = [];

  for (const file of req.files) {
    const filename = file.filename;
    const fileUrl = `/uploads/${filename}`;

    try {
      const diskPath = path.join(uploadDir, filename);
      if (fs.existsSync(diskPath)) {
        const buffer = fs.readFileSync(diskPath);
        const base64Data = buffer.toString('base64');
        await Media.findOneAndUpdate(
          { filename },
          {
            filename,
            originalName: file.originalname,
            contentType: file.mimetype || 'image/jpeg',
            data: base64Data,
            size: file.size
          },
          { upsert: true, new: true }
        );
      }
    } catch (err) {
      console.warn('[Multiple Upload DB Sync Warning]:', err.message);
    }

    savedFiles.push({
      url: fileUrl,
      filename: filename,
      originalName: file.originalname,
      size: file.size
    });
  }

  return res.status(200).json({
    success: true,
    message: `${savedFiles.length} image(s) uploaded successfully.`,
    files: savedFiles,
    urls: savedFiles.map((f) => f.url)
  });
};

// @desc    Serve uploaded image (from disk if available, otherwise from MongoDB Media)
// @route   GET /uploads/:filename
// @access  Public
export const serveUploadedMedia = async (req, res, next) => {
  const { filename } = req.params;
  const safeFilename = path.basename(filename);
  const diskPath = path.join(uploadDir, safeFilename);

  // 1. If present on disk, serve from disk directly
  if (fs.existsSync(diskPath)) {
    return res.sendFile(diskPath);
  }

  // 2. If not on disk (e.g. Render restarted or different machine), retrieve from MongoDB
  try {
    const media = await Media.findOne({ filename: safeFilename });
    if (media && media.data) {
      const buffer = Buffer.from(media.data, 'base64');
      // Save back to local disk cache for instant subsequent hits
      try {
        fs.writeFileSync(diskPath, buffer);
      } catch (cacheErr) {
        // Non-fatal if disk write fails
      }

      res.set('Content-Type', media.contentType || 'image/jpeg');
      res.set('Cache-Control', 'public, max-age=31536000, immutable');
      return res.send(buffer);
    }
  } catch (err) {
    console.error('[Serve Media DB Fallback Error]:', err);
  }

  // 3. Fallback to 404 or next
  return res.status(404).json({
    success: false,
    message: 'Image not found'
  });
};

// @desc    Delete uploaded image file
// @route   DELETE /api/upload/:filename
// @access  Private (Admin)
export const deleteUploadedImage = async (req, res) => {
  const { filename } = req.params;
  const safeFilename = path.basename(filename);
  const filePath = path.join(uploadDir, safeFilename);

  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    await Media.deleteOne({ filename: safeFilename });

    return res.status(200).json({
      success: true,
      message: 'Image file removed successfully.'
    });
  } catch (err) {
    console.error('Delete image error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete file.'
    });
  }
};
