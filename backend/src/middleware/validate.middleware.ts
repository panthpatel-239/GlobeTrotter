import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny, ZodError } from 'zod';
import { ApiError } from '../utils/apiError';

interface RequestValidationSchema {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
}

export const validateRequest = (schema: RequestValidationSchema | ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if ('parseAsync' in schema) {
        // Direct body schema (ZodObject or ZodEffects)
        req.body = await schema.parseAsync(req.body);
      } else {
        // Complex schema with body/query/params
        if (schema.params) {
          req.params = await schema.params.parseAsync(req.params);
        }
        if (schema.query) {
          req.query = await schema.query.parseAsync(req.query);
        }
        if (schema.body) {
          req.body = await schema.body.parseAsync(req.body);
        }
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));
        next(ApiError.badRequest(errorMessages[0]?.message || 'Validation error', errorMessages));
      } else {
        next(error);
      }
    }
  };
};
