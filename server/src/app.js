import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import settingRoutes from './routes/settingRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security headers with crossOriginResourcePolicy allowed for uploaded images
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false // Allow inline assets in local development
  })
);

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// CORS setup
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
  'http://localhost:3000',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  })
);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Static file serving for uploads
const uploadDir = path.resolve(__dirname, '../uploads');
app.use('/uploads', express.static(uploadDir));

// Fallback static serving for client assets
const clientAssetsDir = path.resolve(__dirname, '../../client/public/assets');
app.use('/assets', express.static(clientAssetsDir));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    business: 'SHRIJI NAMKEEN API',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/upload', uploadRoutes);

// Serve static client assets in production if built
const clientDistDir = path.resolve(__dirname, '../../client/dist');
const indexHtmlPath = path.join(clientDistDir, 'index.html');
if (fs.existsSync(clientDistDir)) {
  app.use(express.static(clientDistDir));
}

// SPA fallback for all non-API and non-upload routes
app.get('*', (req, res, next) => {
  if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/uploads')) {
    return next();
  }
  if (fs.existsSync(indexHtmlPath)) {
    return res.sendFile(indexHtmlPath);
  }
  next();
});

// Error handlers
app.use(notFound);
app.use(errorHandler);

export default app;
