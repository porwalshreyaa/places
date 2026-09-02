import { Router } from 'express';
import { userSettingsController } from '../controllers/userSettings.controller';
import { authenticateToken } from '../middleware/auth';
import { validateRequest } from '../middleware/validate';
import { userSettingsSchema } from '../validators';

const router = Router();

router.put('/', authenticateToken, validateRequest(userSettingsSchema), userSettingsController.updateSettings.bind(userSettingsController));

export default router;
