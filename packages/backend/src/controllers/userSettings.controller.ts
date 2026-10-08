import { handleServerError } from '../utils/error';
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { usersCrud } from '../crud/users.crud';
import { themesCrud } from '../crud/themes.crud';

export class UserSettingsController {
  async updateSettings(req: AuthRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

      const { notes_to_self, is_public, map_drawings, theme_title, theme_subtitle, theme_id } = req.body;
      
      const updates: Record<string, unknown> = {};
      if (notes_to_self !== undefined) updates.notes_to_self = notes_to_self;
      if (is_public !== undefined) updates.is_public = is_public;
      if (map_drawings !== undefined) updates.map_drawings = map_drawings;
      if (theme_title !== undefined) updates.theme_title = theme_title;
      if (theme_subtitle !== undefined) updates.theme_subtitle = theme_subtitle;
      if (theme_id !== undefined) updates.theme_id = theme_id;

      if (Object.keys(updates).length > 0) {
        await usersCrud.update(req.user.userId, updates);
      }
      let updatedTheme = null;
      if (theme_id !== undefined) {
        updatedTheme = await themesCrud.findById(theme_id);
      }
      
      res.json({ success: true, theme: updatedTheme });
    } catch (err: unknown) {
      handleServerError(res, err);
    }
  }
}

export const userSettingsController = new UserSettingsController();
