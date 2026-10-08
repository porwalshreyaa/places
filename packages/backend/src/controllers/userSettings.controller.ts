import { handleServerError } from '../utils/error';
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { usersCrud } from '../crud/users.crud';
import { themesCrud } from '../crud/themes.crud';
import { sanitizeString, sanitizeMapDrawings } from '../utils/sanitizer';

export class UserSettingsController {
  async updateSettings(req: AuthRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

      const { notes_to_self, is_public, map_drawings, theme_title, theme_subtitle, theme_id } = req.body;
      
      const updates: Record<string, unknown> = {};
      if (notes_to_self !== undefined) updates.notes_to_self = sanitizeString(notes_to_self, 10000);
      if (is_public !== undefined) updates.is_public = Boolean(is_public);
      if (map_drawings !== undefined) updates.map_drawings = sanitizeMapDrawings(map_drawings);
      if (theme_title !== undefined) updates.theme_title = sanitizeString(theme_title, 100);
      if (theme_subtitle !== undefined) updates.theme_subtitle = sanitizeString(theme_subtitle, 200);
      if (theme_id !== undefined) updates.theme_id = sanitizeString(theme_id, 50);

      if (Object.keys(updates).length > 0) {
        await usersCrud.update(req.user.userId, updates);
      }
      let updatedTheme = null;
      if (theme_id !== undefined && updates.theme_id) {
        updatedTheme = await themesCrud.findById(updates.theme_id as string);
      }
      
      res.json({ success: true, theme: updatedTheme });
    } catch (err: unknown) {
      handleServerError(res, err);
    }
  }
}

export const userSettingsController = new UserSettingsController();
