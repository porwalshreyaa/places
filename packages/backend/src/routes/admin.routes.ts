import { Router } from 'express';
import { authenticateToken, authenticateAdmin } from '../middleware/auth';
import { adminController } from '../controllers/admin.controller';

const router = Router();

// Protect all admin routes
router.use(authenticateToken, authenticateAdmin);

router.get('/stats', adminController.getStats.bind(adminController));

export default router;
