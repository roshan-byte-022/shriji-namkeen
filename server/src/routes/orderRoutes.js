import express from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getDashboardStats
} from '../controllers/orderController.js';
import { protectAdmin } from '../middleware/auth.js';
import { orderLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public: place retail order or wholesale inquiry
router.post('/', orderLimiter, createOrder);

// Admin: dashboard stats and management
router.get('/stats/summary', protectAdmin, getDashboardStats);
router.get('/', protectAdmin, getOrders);
router.get('/:id', protectAdmin, getOrderById);
router.patch('/:id/status', protectAdmin, updateOrderStatus);
router.delete('/:id', protectAdmin, deleteOrder);

export default router;
