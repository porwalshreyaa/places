import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { destinationsService } from '../services/destinations.service';
import { rawDestinationsListSchema } from '../validators';
import { BadRequestError, UnauthorizedError } from '../utils/errors';

export class DestinationsController {
  async getDestinations(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Unauthorized');
      }

      const userDestinations = await destinationsService.getUserDestinations(req.user.userId);
      res.json(userDestinations);
    } catch (error) {
      next(error);
    }
  }

  async saveDestinations(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Unauthorized');
      }

      const parseResult = rawDestinationsListSchema.safeParse(req.body);
      if (!parseResult.success) {
        throw new BadRequestError('Invalid destinations data format', parseResult.error.errors);
      }

      const result = await destinationsService.saveUserDestinations(req.user.userId, parseResult.data);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const destinationsController = new DestinationsController();
