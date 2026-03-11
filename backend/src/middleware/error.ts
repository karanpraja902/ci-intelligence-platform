import { Request, Response, NextFunction } from 'express';
import logger from '../lib/logger.js';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  if (status >= 500) {
    logger.error({ err }, 'Unhandled error');
  }
  res.status(status).json({ error: message });
}