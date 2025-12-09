import { Router } from 'express';
import authRoutes from './auth.routes';
import ticketRoutes from './ticket.routes';
import analyticsRoutes from '../routes/analytic.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/tickets', ticketRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
