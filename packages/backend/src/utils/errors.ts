/**
 * Base custom error class for HTTP domain exceptions.
 */
export class CustomError extends Error {
  abstract readonly statusCode: number;
  readonly details?: unknown;

  constructor(message: string, details?: unknown) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class BadRequestError extends CustomError {
  readonly statusCode = 400;
  constructor(message = 'Bad Request', details?: unknown) {
    super(message, details);
  }
}

export class UnauthorizedError extends CustomError {
  readonly statusCode = 401;
  constructor(message = 'Unauthorized', details?: unknown) {
    super(message, details);
  }
}

export class ForbiddenError extends CustomError {
  readonly statusCode = 403;
  constructor(message = 'Forbidden', details?: unknown) {
    super(message, details);
  }
}

export class NotFoundError extends CustomError {
  readonly statusCode = 404;
  constructor(message = 'Not Found', details?: unknown) {
    super(message, details);
  }
}

export class ConflictError extends CustomError {
  readonly statusCode = 409;
  constructor(message = 'Conflict', details?: unknown) {
    super(message, details);
  }
}

export class InternalServerError extends CustomError {
  readonly statusCode = 500;
  constructor(message = 'Internal Server Error', details?: unknown) {
    super(message, details);
  }
}
