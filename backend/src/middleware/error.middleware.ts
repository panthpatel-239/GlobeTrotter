import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';
import { ApiResponse } from '../utils/apiResponse';
import { env } from '../config/env';

export const errorHandler = (
  err: Error | ApiError | any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal server error';
  let errors: any[] | undefined = undefined;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  } else if (err.name === 'PrismaClientKnownRequestError') {
    // Handle Prisma specific known errors
    if (err.code === 'P2002') {
      statusCode = 409;
      const target = (err.meta?.target as string[]) || [];
      message = `A record with this ${target.join(', ') || 'field'} already exists`;
    } else if (err.code === 'P2025') {
      statusCode = 404;
      message = 'Requested record not found';
    } else {
      statusCode = 400;
      message = 'Database operation failed';
    }
  } else if (err.name === 'PrismaClientValidationError') {
    statusCode = 400;
    message = 'Invalid data provided for database operation';
  } else if (err.name === 'SyntaxError') {
    statusCode = 400;
    message = 'Malformed JSON in request body';
  } else if (err.message) {
    message = err.message;
  }

  if (env.NODE_ENV === 'development') {
    console.error(`[Error] ${req.method} ${req.originalUrl}:`, err);
  }

  ApiResponse.error(res, message, statusCode, errors);
};

export const notFoundHandler = (req: Request, res: Response): void => {
  ApiResponse.error(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
};
