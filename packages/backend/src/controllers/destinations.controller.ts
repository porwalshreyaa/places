import { handleServerError, AppError } from '../utils/error';
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { destinationsCrud } from '../crud/destinations.crud';
import { sanitizeDestinationRecord } from '../utils/sanitizer';
import { uploadService } from '../services/upload.service';
import { rawDestinationsListSchema } from '../validators';

export class DestinationsController {
  async getDestinations(req: AuthRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      
      const userDestinations = await destinationsCrud.findByUserId(req.user.userId);
      res.json(userDestinations);
    } catch (error: AppError) {
      handleServerError(res, error);
    }
  }

  async saveDestinations(req: AuthRequest, res: Response) {
    let newCatboxUrls: string[] = [];
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

      // Validate incoming destination array payload using Zod schema
      const parseResult = rawDestinationsListSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: 'Invalid destinations data format', details: parseResult.error.errors });
      }

      const newDestinations = parseResult.data;

      // Fetch current user destinations to identify newly added images
      const existingDestinations = await destinationsCrud.findByUserId(req.user.userId);
      const existingImageUrls = new Set(existingDestinations.map(d => d.image).filter(Boolean));

      const recordsToInsert = newDestinations.map((d, index) => sanitizeDestinationRecord(d, req.user!.userId, index));

      // Find any new Catbox image URLs introduced in this request
      newCatboxUrls = recordsToInsert
        .map(d => d.image)
        .filter((img): img is string => Boolean(img && img.includes('catbox.moe') && !existingImageUrls.has(img)));

      await destinationsCrud.bulkDeleteAndInsert(req.user.userId, recordsToInsert);
      
      res.json({ success: true, message: "Destinations saved successfully" });
    } catch (error: AppError) {
      // ROLLBACK CLEANUP: If DB save failed, clean up newly uploaded Catbox images
      if (newCatboxUrls.length > 0) {
        console.warn(`[Rollback Cleanup] Database write failed. Deleting ${newCatboxUrls.length} newly uploaded Catbox image(s)...`);
        uploadService.deleteFromCatbox(newCatboxUrls).catch(err => {
          console.error('[Rollback Cleanup] Failed to delete Catbox images on rollback:', err);
        });
      }
      handleServerError(res, error);
    }
  }
}

export const destinationsController = new DestinationsController();
