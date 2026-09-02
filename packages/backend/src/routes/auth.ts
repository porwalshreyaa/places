import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth';
import { validateRequest } from '../middleware/validate';
import { authSchema, registerSchema } from '../validators';

const router = Router();

router.get('/check-availability', authController.checkAvailability.bind(authController));
router.post('/register', validateRequest(registerSchema), authController.register.bind(authController));
router.post('/login', validateRequest(authSchema), authController.login.bind(authController));
router.get('/me', authenticateToken, authController.getMe.bind(authController));

export default router;
