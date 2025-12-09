import { Router } from 'express';
import { getStats } from '../controllers/analytics.controller';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken);
router.use(requireAdmin);

router.get('/', getStats);

export default router;
