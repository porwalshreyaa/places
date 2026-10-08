import { handleServerError, AppError } from '../utils/error';
import { Request, Response } from 'express';
import { themesService } from '../services/themes.service';
import { sanitizeString } from '../utils/sanitizer';
import { createThemeSchema } from '../validators';
import crypto from 'crypto';

export class ThemesController {
  async getThemes(req: Request, res: Response) {
    try {
      const themes = await themesService.getAllThemes();
      res.json(themes);
    } catch (err: AppError) {
      handleServerError(res, err);
    }
  }

  async createTheme(req: Request, res: Response) {
    try {
      // Validate theme creation payload using Zod schema
      const parseResult = createThemeSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: 'Invalid theme data payload', details: parseResult.error.errors });
      }

      const { name, base_color, colors } = parseResult.data;
      const creator_id = (req as { user?: { userId: string } }).user?.userId;
      
      const cleanName = sanitizeString(name, 100);
      const cleanBaseColor = sanitizeString(base_color, 30);

      // Sanitize colors record
      const cleanColors: Record<string, string> = {};
      for (const [key, val] of Object.entries(colors)) {
        cleanColors[sanitizeString(key, 50)] = sanitizeString(val, 30);
      }

      // Generate a simple hash of the colors to ensure uniqueness
      const colorHash = crypto.createHash('md5').update(JSON.stringify(cleanColors)).digest('hex');

      const newTheme = await themesService.createTheme({
        name: cleanName,
        creator_id: creator_id || null,
        base_color: cleanBaseColor,
        colors: cleanColors,
        color_hash: colorHash,
        is_system: false
      });

      res.status(201).json(newTheme);
    } catch (err: AppError) {
      handleServerError(res, err);
    }
  }
}

export const themesController = new ThemesController();
