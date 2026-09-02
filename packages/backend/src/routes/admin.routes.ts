import { Router, Request, Response } from 'express';
import { authenticateToken, authenticateAdmin } from '../middleware/auth';
import { db } from '../db';
import { users } from '../schema/users.schema';
import { destinations } from '../schema/destinations.schema';
import { themes } from '../schema/themes.schema';
import { sql } from 'drizzle-orm';

const router = Router();

// Protect all admin routes
router.use(authenticateToken, authenticateAdmin);

router.get('/stats', async (req: Request, res: Response) => {
  try {
    const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(users);
    const [destCount] = await db.select({ count: sql<number>`count(*)` }).from(destinations);
    const [themeCount] = await db.select({ count: sql<number>`count(*)` }).from(themes);

    res.json({
      totalUsers: userCount.count,
      totalDestinations: destCount.count,
      totalThemes: themeCount.count
    });
  } catch (error) {
    console.error('Failed to fetch admin stats:', error);
    res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
});

export default router;
