import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { APIError } from '../types/index';

export const errorHandler = (
  error: Error | APIError, 
  req: Request, 
  res: Response, 
  _next: NextFunction
): void => {
  logger.error('Error occurred', {
    error: error.message,
    stack: 'stack' in error ? error.stack : undefined,
    url: req.url,
    method: req.method,
    ip: req.ip
  });

  if ('statusCode' in error && 'code' in error) {
    const apiError = error as APIError;
    res.status(apiError.statusCode).json({
      error: {
        message: apiError.message,
        code: apiError.code,
        retryable: apiError.retryable
      }
    });
    return;
  }

  // Default error response
  res.status(500).json({
    error: {
      message: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR',
      retryable: false
    }
  });
};