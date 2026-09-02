import { getErrorMessage } from '../utils/error';
import { Request, Response } from 'express';
import { themesService } from '../services/themes.service';
import crypto from 'crypto';

export class ThemesController {
  async getThemes(req: Request, res: Response) {
    try {
      const themes = await themesService.getAllThemes();
      res.json(themes);
    } catch (err: unknown) {
      res.status(500).json({ error: getErrorMessage(err) });
    }
  }

  async createTheme(req: Request, res: Response) {
    try {
      const { name, base_color, colors } = req.body;
      const creator_id = (req as any).user?.userId;
      
      if (!name || !base_color || !colors) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Generate a simple hash of the colors to ensure uniqueness
      const colorHash = crypto.createHash('md5').update(JSON.stringify(colors)).digest('hex');

      const newTheme = await themesService.createTheme({
        name,
        creator_id: creator_id || null,
        base_color,
        colors,
        color_hash: colorHash,
        is_system: false
      });

      res.status(201).json(newTheme);
    } catch (err: unknown) {
      res.status(500).json({ error: getErrorMessage(err) });
    }
  }
}

export const themesController = new ThemesController();
