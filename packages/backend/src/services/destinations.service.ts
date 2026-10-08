import { destinationsCrud } from '../crud/destinations.crud';
import { sanitizeDestinationRecord } from '../utils/sanitizer';
import { uploadService } from './upload.service';
import { RawDestinationInput } from '../validators';
import { Destination } from '../models/destinations.model';

export class DestinationsService {
  async getUserDestinations(userId: string): Promise<Destination[]> {
    return destinationsCrud.findByUserId(userId);
  }

  async saveUserDestinations(userId: string, newDestinations: RawDestinationInput[]) {
    let newCatboxUrls: string[] = [];
    try {
      // Fetch existing user destinations to compare images
      const existingDestinations = await destinationsCrud.findByUserId(userId);
      const existingImageUrls = new Set(existingDestinations.map(d => d.image).filter(Boolean));

      // Sanitize input records
      const recordsToInsert = newDestinations.map((d, index) =>
        sanitizeDestinationRecord(d, userId, index)
      );

      // Find any newly added Catbox image URLs in this save request
      newCatboxUrls = recordsToInsert
        .map(d => d.image)
        .filter((img): img is string => Boolean(img && img.includes('catbox.moe') && !existingImageUrls.has(img)));

      await destinationsCrud.bulkDeleteAndInsert(userId, recordsToInsert);

      return { success: true, message: 'Destinations saved successfully' };
    } catch (error) {
      // ROLLBACK CLEANUP: If DB save fails, clean up newly uploaded Catbox images
      if (newCatboxUrls.length > 0) {
        console.warn(`[Rollback Cleanup] Database write failed. Deleting ${newCatboxUrls.length} newly uploaded Catbox image(s)...`);
        uploadService.deleteFromCatbox(newCatboxUrls).catch(err => {
          console.error('[Rollback Cleanup] Failed to delete Catbox images on rollback:', err);
        });
      }
      throw error;
    }
  }
}

export const destinationsService = new DestinationsService();
