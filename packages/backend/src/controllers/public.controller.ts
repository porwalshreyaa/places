import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service';

export class PublicController {
  async getPublicProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { username } = req.params;
      const profile = await userService.getPublicProfile(username);
      res.json(profile);
    } catch (err) {
      next(err);
    }
  }
}

export const publicController = new PublicController();
