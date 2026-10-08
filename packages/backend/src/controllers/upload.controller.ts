import { Request, Response, NextFunction } from 'express';
import { uploadService } from '../services/upload.service';
import { uploadPayloadSchema } from '../validators';
import { BadRequestError } from '../utils/errors';

export class UploadController {
  async uploadFile(req: Request, res: Response, next: NextFunction) {
    try {
      const parseResult = uploadPayloadSchema.safeParse(req.body);
      if (!parseResult.success) {
        throw new BadRequestError(
          parseResult.error.errors[0]?.message || 'Invalid upload payload',
          parseResult.error.errors
        );
      }

      const { image, filename } = parseResult.data;
      const url = await uploadService.processBase64Upload(image, filename);
      console.log(`Successfully saved local image file to ${url}`);
      res.json({ success: true, url });
    } catch (err) {
      next(err);
    }
  }
}

export const uploadController = new UploadController();
