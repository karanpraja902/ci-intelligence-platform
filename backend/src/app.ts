import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import logger from './lib/logger.js';
import { errorHandler } from './middleware/error.js';
import authRoutes from './modules/auth/routes.js';
import repoRoutes from './modules/repos/routes.js';
import { authMiddleware } from './middleware/auth.js';
import { config } from './config/env.js';

export function createApp() {
  const app = express();

  app.use(cors({ origin: config.frontendUrl, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  // Protected API routes\n  app.use('/api', authMiddleware);\n  // Public + private routers (private ones begin with /api)
  app.use(authRoutes);\n  app.use(repoRoutes);

  app.use(errorHandler);

  // Log registered routes in dev
  if (process.env.NODE_ENV !== 'production') {
    app._router?.stack?.forEach((layer: any) => {
      if (layer.route) {
        logger.info({ method: Object.keys(layer.route.methods)[0], path: layer.route.path }, 'route');
      }
    });
  }

  return app;
}