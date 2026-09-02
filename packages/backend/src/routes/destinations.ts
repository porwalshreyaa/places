import { Router } from 'express';
import { destinationsController } from '../controllers/destinations.controller';
import { authenticateToken } from '../middleware/auth';
import { validateRequest } from '../middleware/validate';
import { destinationsListSchema } from '../validators';

const router = Router();

router.get('/', authenticateToken, destinationsController.getDestinations.bind(destinationsController));
router.post('/', authenticateToken, validateRequest(destinationsListSchema), destinationsController.saveDestinations.bind(destinationsController));

export default router;
