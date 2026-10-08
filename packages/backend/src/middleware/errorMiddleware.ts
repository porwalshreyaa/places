import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../utils/errors';
import { logError } from '../utils/error';

/**
 * Central Express error handling middleware.
 * Catches all errors passed to next(err) or thrown in async handlers.
 */
export function errorMiddleware(
  err: Error | CustomError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): Response {
  const context = `${req.method} ${req.originalUrl}`;

  if (err instanceof CustomError) {
    logError(err, context);
    return res.status(err.statusCode).json({
      error: err.message,
      ...(err.details ? { details: err.details } : {})
    });
  }

  // Fallback for unhandled unexpected internal errors
  logError(err, context);
  return res.status(500).json({
    error: 'We are currently experiencing high traffic. Please try again shortly.'
  });
}
