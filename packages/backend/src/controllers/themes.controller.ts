import { handleServerError } from '../utils/error';
import { Request, Response } from 'express';
import { themesService } from '../services/themes.service';
import { sanitizeString } from '../utils/sanitizer';
import crypto from 'crypto';

export class ThemesController {
  async getThemes(req: Request, res: Response) {
    try {
      const themes = await themesService.getAllThemes();
      res.json(themes);
    } catch (err: unknown) {
      handleServerError(res, err);
    }
  }

  async createTheme(req: Request, res: Response) {
    try {
      const { name, base_color, colors } = req.body;
      const creator_id = (req as { user?: { userId: string } }).user?.userId;
      
      const cleanName = sanitizeString(name, 100);
      const cleanBaseColor = sanitizeString(base_color, 30);
      
      if (!cleanName || !cleanBaseColor || !colors || typeof colors !== 'object') {
        return res.status(400).json({ error: 'Missing required fields' });
      }

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
    } catch (err: unknown) {
      handleServerError(res, err);
    }
  }
}

export const themesController = new ThemesController();
