import { Request, Response, NextFunction } from 'express';
import { logger } from './logger';
import AppConfig, { AppConfigType } from '../app_config';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

import { ErrorRequestHandler } from 'express';

const config: AppConfigType = AppConfig.getConfig();

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  logger.error('Error handled:', {
    message: err.message,
    stack: err.stack,
    statusCode: (err as AppError).statusCode, // Cast to access AppError specific props
    isOperational: (err as AppError).isOperational,
    path: req.path,
    method: req.method
  });

  if (err instanceof AppError) {
    if (config.nodeEnv === 'production') {
      res.status(err.statusCode).json({
        status: 'error',
        message: 'An unexpected error occurred. Please try again later.',
        isOperational: err.isOperational
      });
    } else {
      res.status(err.statusCode).json({
        status: 'error',
        message: err.message,
        isOperational: err.isOperational
      });
    }
    return;
  }

  res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
}; 