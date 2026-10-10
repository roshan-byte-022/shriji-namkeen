import dotenv from 'dotenv';
dotenv.config();

import app from './src/app.js';
import { connectDB } from './src/config/db.js';
import seedDatabase from './src/config/seed.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    // Auto-seed basic data (admin, categories, initial products) if database is fresh
    await seedDatabase();

    const server = app.listen(PORT, () => {
      console.log(`[SHRIJI NAMKEEN Server] Running on http://localhost:${PORT} (${process.env.NODE_ENV || 'development'})`);
    });

    const shutdown = () => {
      console.log('Shutting down server gracefully...');
      server.close(() => {
        console.log('Server terminated.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

    process.on('unhandledRejection', (err) => {
      console.error('[Unhandled Rejection]:', err);
    });

    process.on('uncaughtException', (err) => {
      console.error('[Uncaught Exception]:', err);
    });
  } catch (error) {
    console.error('Fatal error starting server:', error);
    process.exit(1);
  }
};

startServer();
