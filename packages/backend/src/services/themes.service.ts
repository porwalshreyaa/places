import { themesCrud } from '../crud/themes.crud';
import { NewTheme, Theme } from '../models/themes.model';

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

  async createTheme(theme: NewTheme): Promise<Theme> {
    // Check if hash exists
    const existing = await this.getThemeByHash(theme.color_hash);
    if (existing) {
      return existing; // return the existing theme instead of failing
    }
    return themesCrud.create(theme);
  }
}

export const themesService = new ThemesService();
