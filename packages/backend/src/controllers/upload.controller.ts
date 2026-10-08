import { handleServerError, AppError } from '../utils/error';
import { Request, Response } from 'express';
import { uploadService } from '../services/upload.service';
import { uploadPayloadSchema } from '../validators';

export class UploadController {
  async uploadFile(req: Request, res: Response) {
    try {
      // Validate photo upload payload using Zod schema
      const parseResult = uploadPayloadSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ success: false, error: parseResult.error.errors[0]?.message || 'Invalid upload payload' });
      }

      const { image, filename } = parseResult.data;
      const url = await uploadService.processBase64Upload(image, filename);
      console.log(`Successfully saved local image file to ${url}`);
      res.json({ success: true, url });
    } catch (err: AppError) {
      handleServerError(res, err);
    }
  }
}

export const uploadController = new UploadController();
