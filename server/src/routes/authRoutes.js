import express from 'express';
import {
  login,
  logout,
  getMe,
  updateProfile
} from '../controllers/authController.js';
import { protectAdmin } from '../middleware/auth.js';
import { loginLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/login', loginLimiter, login);
router.post('/logout', logout);
router.get('/me', protectAdmin, getMe);
router.put('/profile', protectAdmin, updateProfile);

export default router;
