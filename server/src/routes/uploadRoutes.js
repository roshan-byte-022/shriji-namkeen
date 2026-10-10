import express from 'express';
import {
  uploadSingleImage,
  uploadMultipleImages,
  serveUploadedMedia,
  deleteUploadedImage
} from '../controllers/uploadController.js';
import { protectAdmin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/:filename', serveUploadedMedia);
router.post('/', protectAdmin, upload.single('image'), uploadSingleImage);
router.post('/multiple', protectAdmin, upload.array('images', 5), uploadMultipleImages);
router.delete('/:filename', protectAdmin, deleteUploadedImage);

export default router;
