import { getErrorMessage } from '../utils/error';
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { destinationsCrud } from '../crud/destinations.crud';

export class DestinationsController {
  async getDestinations(req: AuthRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      
      const userDestinations = await destinationsCrud.findByUserId(req.user.userId);
      res.json(userDestinations);
    } catch (error: any) {
      console.error("Error fetching destinations:", error);
      res.status(500).json({ error: getErrorMessage(error) });
    }
  }

  async saveDestinations(req: AuthRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      
      const newDestinations = req.body;
      if (!Array.isArray(newDestinations)) {
        return res.status(400).json({ error: "Invalid data format" });
      }

      const recordsToInsert = newDestinations.map(d => ({
        id: d.id,
        user_id: req.user!.userId,
        name: d.name,
        country: d.country,
        coordinates: d.coordinates,
        description: d.description,
        image: d.image,
        notes: d.notes,
        checklist: d.checklist,
        stickers: d.stickers,
      }));

      await destinationsCrud.bulkDeleteAndInsert(req.user.userId, recordsToInsert);
      
      res.json({ success: true, message: "Destinations saved successfully" });
    } catch (error: any) {
      console.error("Error saving destinations:", error);
      res.status(500).json({ error: getErrorMessage(error) });
    }
  }
}

export const destinationsController = new DestinationsController();
