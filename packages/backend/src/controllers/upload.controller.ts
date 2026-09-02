import { getErrorMessage } from '../utils/error';
import { Request, Response } from 'express';
import { uploadService } from '../services/upload.service';

export class UploadController {
  async uploadFile(req: Request, res: Response) {
    try {
      const { image, filename } = req.body;
      if (!image) {
        return res.status(400).json({ success: false, error: "No image payload found" });
      }

      const url = await uploadService.processBase64Upload(image, filename);
      console.log(`Successfully saved local image file to ${url}`);
      res.json({ success: true, url });
    } catch (err: unknown) {
      console.error("Error writing uploaded file:", err);
      res.status(500).json({ success: false, error: getErrorMessage(err) });
    }
  }
}

export const uploadController = new UploadController();
