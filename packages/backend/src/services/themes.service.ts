import crypto from 'crypto';
import { themesCrud } from '../crud/themes.crud';
import { Theme } from '../models/themes.model';
import { sanitizeString } from '../utils/sanitizer';
import { CreateThemePayload } from '../validators';

export class ThemesService {
  async getAllThemes(): Promise<Theme[]> {
    return themesCrud.findAll();
  }

  async getThemeById(id: string): Promise<Theme | null> {
    return themesCrud.findById(id);
  }
  
  async getThemeByHash(hash: string): Promise<Theme | undefined> {
    const all = await themesCrud.findAll();
    return all.find(t => t.color_hash === hash);
  }

  async createTheme(payload: CreateThemePayload, creatorId?: string): Promise<Theme> {
    const cleanName = sanitizeString(payload.name, 100);
    const cleanBaseColor = sanitizeString(payload.base_color, 30);

    const cleanColors: Record<string, string> = {};
    for (const [key, val] of Object.entries(payload.colors)) {
      cleanColors[sanitizeString(key, 50)] = sanitizeString(val, 30);
    }

    const colorHash = crypto.createHash('md5').update(JSON.stringify(cleanColors)).digest('hex');

    const existing = await this.getThemeByHash(colorHash);
    if (existing) {
      return existing;
    }

    return themesCrud.create({
      name: cleanName,
      creator_id: creatorId || null,
      base_color: cleanBaseColor,
      colors: cleanColors,
      color_hash: colorHash,
      is_system: false
    });
  }
}

export const themesService = new ThemesService();
