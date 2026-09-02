import { Router } from 'express';
import { themesController } from '../controllers/themes.controller';
import { authenticateToken } from '../middleware/auth';
import { validateRequest } from '../middleware/validate';
import { createThemeSchema } from '../validators';

const router = Router();

router.get('/', themesController.getThemes.bind(themesController));
router.post('/', authenticateToken, validateRequest(createThemeSchema), themesController.createTheme.bind(themesController));

export default router;
