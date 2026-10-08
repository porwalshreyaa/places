import { db } from '../db';
import { users } from '../schema/users.schema';
import { destinations } from '../schema/destinations.schema';
import { themes } from '../schema/themes.schema';
import { sql } from 'drizzle-orm';

export interface AdminStats {
  totalUsers: number;
  totalDestinations: number;
  totalThemes: number;
}

class AdminCrud {
  async getSystemStats(): Promise<AdminStats> {
    const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(users);
    const [destCount] = await db.select({ count: sql<number>`count(*)` }).from(destinations);
    const [themeCount] = await db.select({ count: sql<number>`count(*)` }).from(themes);

    return {
      totalUsers: Number(userCount?.count || 0),
      totalDestinations: Number(destCount?.count || 0),
      totalThemes: Number(themeCount?.count || 0)
    };
  }
}

export const adminCrud = new AdminCrud();
