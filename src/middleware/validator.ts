import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';
import { BadRequestError } from './errorHandler';

export const validate = 
  (schema: AnyZodObject) => 
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      throw new BadRequestError((error as Error).message);
    }
  };