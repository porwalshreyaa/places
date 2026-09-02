import { Router } from 'express';
import { publicController } from '../controllers/public.controller';

const router = Router();

router.get('/user/:username', publicController.getPublicProfile);

export default router;
