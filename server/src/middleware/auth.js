import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin.js';

export const protectAdmin = async (req, res, next) => {
  try {
    let token = null;

    // Check cookies first (HttpOnly)
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    // Check Authorization header fallback
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in to continue.'
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'shriji_namkeen_jwt_secret_secure_key_2026_azamgarh'
    );

    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin || !admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Administrator account not found or deactivated.'
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired session. Please log in again.'
    });
  }
};
