import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { config } from '../config/env';
import { CONSTANTS } from '../config/constants';

export class UploadService {
  async processBase64Upload(image: string, filename?: string): Promise<string> {
    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error('Invalid image base64 format');
    }

    const originalBuffer = Buffer.from(matches[2], 'base64');
    const sanitizedFilename = (filename || 'upload')
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase();

    // Use Sharp to generate highly compressed WebP and AVIF versions
    // We resize it slightly if it's too large, but mainly focus on modern compression
    const imageProcessor = sharp(originalBuffer).resize({ width: CONSTANTS.UPLOAD.RESIZE_MAX_WIDTH, withoutEnlargement: true });
    
    const [webpBuffer, avifBuffer] = await Promise.all([
      imageProcessor.clone().webp({ quality: CONSTANTS.UPLOAD.WEBP_QUALITY, effort: CONSTANTS.UPLOAD.ENCODE_EFFORT }).toBuffer(),
      imageProcessor.clone().avif({ quality: CONSTANTS.UPLOAD.AVIF_QUALITY, effort: CONSTANTS.UPLOAD.ENCODE_EFFORT }).toBuffer()
    ]);

    // Choose the smallest buffer to save storage bandwidth
    let bestBuffer: Buffer;
    let finalMimeType: string;
    let finalExt: string;

    if (avifBuffer.byteLength < webpBuffer.byteLength) {
      bestBuffer = avifBuffer;
      finalMimeType = 'image/avif';
      finalExt = 'avif';
    } else {
      bestBuffer = webpBuffer;
      finalMimeType = 'image/webp';
      finalExt = 'webp';
    }

    console.log(`Original: ${(originalBuffer.byteLength / 1024).toFixed(1)}KB | WebP: ${(webpBuffer.byteLength / 1024).toFixed(1)}KB | AVIF: ${(avifBuffer.byteLength / 1024).toFixed(1)}KB -> Chose ${finalExt.toUpperCase()}`);

    // Create a FormData payload for Catbox
    const formData = new FormData();
    formData.append('reqtype', 'fileupload');
    if (config.upload.userhash) {
      formData.append('userhash', config.upload.userhash);
    }
    
    // Create a Blob from the best compressed buffer
    const blob = new Blob([bestBuffer], { type: finalMimeType });
    formData.append('fileToUpload', blob, `${sanitizedFilename}.${finalExt}`);

    try {
      const response = await fetch(config.upload.catboxUrl, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Catbox API responded with status: ${response.status}`);
      }

      const url = await response.text();
      
      // The API returns the raw text URL, e.g., https://files.catbox.moe/xxxxx.avif
      if (!url.startsWith('http')) {
        throw new Error('Invalid response from Catbox: ' + url);
      }
      
      return url.trim();
    } catch (err) {
      console.error('Failed to upload to Catbox:', err);
      throw err;
    }
  }

  async deleteFromCatbox(fileUrls: string | string[]): Promise<boolean> {
    if (!config.upload.userhash) {
      console.warn('[Catbox Cleanup] Deletion requires CATBOX_USERHASH in environment variables');
      return false;
    }

    const urls = Array.isArray(fileUrls) ? fileUrls : [fileUrls];
    const filenames = urls
      .map(url => (url ? url.split('/').pop() || '' : ''))
      .filter(Boolean)
      .join(' ');

    if (!filenames) return false;

    try {
      const formData = new FormData();
      formData.append('reqtype', 'deletefile');
      formData.append('userhash', config.upload.userhash);
      formData.append('files', filenames);

      const response = await fetch(config.upload.catboxUrl, {
        method: 'POST',
        body: formData,
      });

      const result = await response.text();
      const success = response.ok && result.toLowerCase().includes('deleted');
      if (success) {
        console.log(`[Catbox Cleanup] Successfully deleted from Catbox: ${filenames}`);
      } else {
        console.warn(`[Catbox Cleanup] Catbox delete response: ${result}`);
      }
      return success;
    } catch (err) {
      console.error('[Catbox Cleanup] Failed to delete from Catbox:', err);
      return false;
    }
  }
}

export const uploadService = new UploadService();
