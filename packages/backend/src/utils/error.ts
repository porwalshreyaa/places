import { Response } from 'express';
import { CustomError } from './errors';

const DEFAULT_USER_MESSAGE = 'We are currently experiencing high traffic. Please try again shortly.';

export type AppError = Error | CustomError | { message?: string; stack?: string; code?: string | number } | string | null | undefined;

export function logError(error: AppError, context?: string): void {
  const timestamp = new Date().toISOString();
  const label = context ? `[SERVER ERROR - ${context}]` : '[SERVER ERROR]';
  console.error(`❌ ${timestamp} ${label}:`, error);
}

export function getErrorMessage(error: AppError): string {
  logError(error);
  return DEFAULT_USER_MESSAGE;
}

export function handleServerError(
  res: Response,
  error: AppError,
  userFacingMessage: string = DEFAULT_USER_MESSAGE
): Response {
  const context = `${res.req?.method || ''} ${res.req?.originalUrl || ''}`.trim();
  logError(error, context);

  if (error instanceof CustomError) {
    return res.status(error.statusCode).json({
      error: error.message,
      ...(error.details ? { details: error.details } : {})
    });
  }

  return res.status(400).json({ error: userFacingMessage });
}

export * from './errors';
