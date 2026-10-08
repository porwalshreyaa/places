import { Request, Response, NextFunction } from 'express';
import { adminService } from '../services/admin.service';

export class AdminController {
  async getStats(_req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await adminService.getSystemStats();
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }
}

export const adminController = new AdminController();
