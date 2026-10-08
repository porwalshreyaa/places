import { Response } from 'express';

const DEFAULT_USER_MESSAGE = 'We are currently experiencing high traffic. Please try again shortly.';

/**
 * Standard error shape across server error logging and handling.
 */
export type AppError = Error | { message?: string; stack?: string; code?: string | number } | string | null | undefined;

export function logError(error: AppError, context?: string): void {
  const timestamp = new Date().toISOString();
  const label = context ? `[SERVER ERROR - ${context}]` : '[SERVER ERROR]';
  console.error(`❌ ${timestamp} ${label}:`, error);
}

export function getErrorMessage(error: AppError): string {
  logError(error);
  return DEFAULT_USER_MESSAGE;
}

/**
 * Handles internal backend errors without exposing 500 status or internal SQL/stack traces to the frontend.
 * Logs the exact error trace on backend terminals, and returns HTTP 400 with a friendly traffic message.
 */
export function handleServerError(
  res: Response,
  error: AppError,
  userFacingMessage: string = DEFAULT_USER_MESSAGE
): Response {
  const context = `${res.req?.method || ''} ${res.req?.originalUrl || ''}`.trim();
  logError(error, context);
  return res.status(400).json({ error: userFacingMessage });
}
