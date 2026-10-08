import { handleServerError } from '../utils/error';
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { destinationsCrud } from '../crud/destinations.crud';
import { sanitizeDestinationRecord } from '../utils/sanitizer';

export class DestinationsController {
  async getDestinations(req: AuthRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      
      const userDestinations = await destinationsCrud.findByUserId(req.user.userId);
      res.json(userDestinations);
    } catch (error: unknown) {
      handleServerError(res, error);
    }
  }

  async saveDestinations(req: AuthRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      
      const newDestinations = req.body;
      if (!Array.isArray(newDestinations)) {
        return res.status(400).json({ error: "Invalid data format" });
      }

      const recordsToInsert = newDestinations.map(d => sanitizeDestinationRecord(d, req.user!.userId));

      await destinationsCrud.bulkDeleteAndInsert(req.user.userId, recordsToInsert);
      
      res.json({ success: true, message: "Destinations saved successfully" });
    } catch (error: unknown) {
      handleServerError(res, error);
    }
  }
}

export const destinationsController = new DestinationsController();
