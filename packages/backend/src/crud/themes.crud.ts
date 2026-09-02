import { db } from '../db';
import { eq } from 'drizzle-orm';
import { themes } from '../schema/themes.schema';
import { Theme, NewTheme } from '../models/themes.model';

class ThemesCrud {
  async findAll(): Promise<Theme[]> {
    return db.select().from(themes);
  }

  async findById(id: string): Promise<Theme | null> {
    const result = await db.select().from(themes).where(eq(themes.id, id));
    return result[0] || null;
  }

  async create(data: NewTheme): Promise<Theme> {
    const result = await db.insert(themes).values(data).returning();
    return result[0];
  }

  async update(id: string, data: Partial<NewTheme>): Promise<Theme | null> {
    const result = await db.update(themes).set(data).where(eq(themes.id, id)).returning();
    return result[0] || null;
  }

  async delete(id: string): Promise<Theme | null> {
    const result = await db.delete(themes).where(eq(themes.id, id)).returning();
    return result[0] || null;
  }
}

export const themesCrud = new ThemesCrud();
