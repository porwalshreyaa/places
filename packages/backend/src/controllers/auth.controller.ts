import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { userService } from '../services/user.service';
import { registerSchema, authSchema, checkAvailabilityQuerySchema } from '../validators';
import { BadRequestError, UnauthorizedError } from '../utils/errors';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const parseResult = registerSchema.safeParse(req.body);
      if (!parseResult.success) {
        throw new BadRequestError(
          parseResult.error.errors[0]?.message || 'Invalid registration payload',
          parseResult.error.errors
        );
      }

      const result = await userService.register(parseResult.data);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const parseResult = authSchema.safeParse(req.body);
      if (!parseResult.success) {
        throw new BadRequestError(
          parseResult.error.errors[0]?.message || 'Invalid login payload',
          parseResult.error.errors
        );
      }

      const result = await userService.login(parseResult.data);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async getMe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Unauthorized');
      }

      const profile = await userService.getMe(req.user.userId);
      res.json(profile);
    } catch (err) {
      next(err);
    }
  }

  async checkAvailability(req: Request, res: Response, next: NextFunction) {
    try {
      const parseResult = checkAvailabilityQuerySchema.safeParse(req.query);
      if (!parseResult.success) {
        throw new BadRequestError('Invalid query parameters', parseResult.error.errors);
      }

      const result = await userService.checkAvailability(parseResult.data);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}

export const authController = new AuthController();
