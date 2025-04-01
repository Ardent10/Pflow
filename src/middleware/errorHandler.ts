import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../types';
import logger from '../utils/logger';

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err.stack || err.message);
  
  // Prisma errors
  if (err.code && err.code.startsWith('P')) {
    return res.status(400).json({
      status: 'error',
      message: 'Database constraint violation',
      detail: err.message
    });
  }
  
  // Zod validation errors
  if (err.name === 'ZodError') {
    return res.status(400).json({
      status: 'error',
      message: 'Validation error',
      detail: err.message
    });
  }
  
  // Custom API errors
  if (err.status) {
    return res.status(err.status).json({
      status: 'error',
      message: err.message
    });
  }
  
  // General error
  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    detail: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

export class NotFoundError extends Error implements ApiError {
  status = 404;
  
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class BadRequestError extends Error implements ApiError {
  status = 400;
  
  constructor(message: string) {
    super(message);
    this.name = 'BadRequestError';
  }
}