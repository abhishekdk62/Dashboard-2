import { Router } from 'express';
import { getStats } from '../controllers/analytics.controller';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// Protect analytics with admin role
router.use(authenticateToken);
router.use(requireAdmin);

router.get('/', getStats);

export default router;
