import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleFeatured
} from '../controllers/productController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:slugOrId', getProduct);
router.post('/', protectAdmin, createProduct);
router.put('/:id', protectAdmin, updateProduct);
router.delete('/:id', protectAdmin, deleteProduct);
router.patch('/:id/feature', protectAdmin, toggleFeatured);

export default router;
