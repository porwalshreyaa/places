import { getErrorMessage } from '../utils/error';
import { Request, Response } from 'express';
import { usersCrud } from '../crud/users.crud';
import { destinationsCrud } from '../crud/destinations.crud';
import { themesCrud } from '../crud/themes.crud';

export class PublicController {
  async getPublicProfile(req: Request, res: Response) {
    try {
      const { username } = req.params;
      
      const user = await usersCrud.findByUsername(username);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      if (!user.is_public) {
        return res.status(403).json({ error: 'This profile is private' });
      }

      const userDestinations = await destinationsCrud.findByUserId(user.id);
      
      let theme = null;
      if ((user as any).theme_id) {
        theme = await themesCrud.findById((user as any).theme_id);
      }

      res.json({
        username: user.username,
        notes_to_self: user.notes_to_self,
        map_drawings: user.map_drawings,
        theme_title: user.theme_title,
        theme_subtitle: user.theme_subtitle,
        theme_id: (user as any).theme_id,
        theme: theme || null,
        destinations: userDestinations,
      });
    } catch (err: unknown) {
      res.status(500).json({ error: getErrorMessage(err) });
    }
  }
}

export const publicController = new PublicController();
