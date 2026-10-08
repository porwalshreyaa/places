import { Request, Response, NextFunction } from 'express';
import { themesService } from '../services/themes.service';
import { createThemeSchema } from '../validators';
import { BadRequestError } from '../utils/errors';

export class ThemesController {
  async getThemes(_req: Request, res: Response, next: NextFunction) {
    try {
      const themes = await themesService.getAllThemes();
      res.json(themes);
    } catch (err) {
      next(err);
    }
  }

  async createTheme(req: Request, res: Response, next: NextFunction) {
    try {
      const parseResult = createThemeSchema.safeParse(req.body);
      if (!parseResult.success) {
        throw new BadRequestError('Invalid theme data payload', parseResult.error.errors);
      }

      const creatorId = (req as { user?: { userId: string } }).user?.userId;
      const newTheme = await themesService.createTheme(parseResult.data, creatorId);

      res.status(201).json(newTheme);
    } catch (err) {
      next(err);
    }
  }
}

export const themesController = new ThemesController();
