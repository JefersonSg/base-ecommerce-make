import { type Request, type RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { type Schema, type ValidationError } from 'yup';

type TProperty = 'body' | 'header' | 'params' | 'query';

type TAllSchemas = Record<TProperty, Schema<any>>;

type TValidation = (schemas: Partial<TAllSchemas>) => RequestHandler;

export const validate: TValidation =
  (schemas) => async (req: Request, res, next) => {
    const errorsResult: Record<string, Record<string, string>> = {};

    Object.entries(schemas).forEach(([key, schema]) => {
      try {
        schema.validateSync(req[key as TProperty], { abortEarly: false });
      } catch (err) {
        const yupError = err as ValidationError;
        const errors: Record<string, string> = {};

        yupError.inner.forEach((error) => {
          if (!error.path) return;
          errors[error.path] = error.message;
        });
        errorsResult[key] = errors;
      }
    });

    if (Object.entries(errorsResult).length === 0) {
      next();
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({ errorsResult });
    }
  };
