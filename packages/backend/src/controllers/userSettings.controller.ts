import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { userService } from '../services/user.service';
import { userSettingsSchema } from '../validators';
import { BadRequestError, UnauthorizedError } from '../utils/errors';

export class UserSettingsController {
  async updateSettings(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Unauthorized');
      }

      const parseResult = userSettingsSchema.safeParse(req.body);
      if (!parseResult.success) {
        throw new BadRequestError('Invalid user settings payload', parseResult.error.errors);
      }

      const result = await userService.updateSettings(req.user.userId, parseResult.data);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}

export const userSettingsController = new UserSettingsController();
