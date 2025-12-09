import { Router } from 'express';
import authRoutes from './auth.routes';
import ticketRoutes from './ticket.routes';
import analyticsRoutes from '../controllers/analytics.controller';

const router = Router();

router.use('/auth', authRoutes);
router.use('/tickets', ticketRoutes);
router.get('/analytics', analyticsRoutes.getStats);

export default router;
