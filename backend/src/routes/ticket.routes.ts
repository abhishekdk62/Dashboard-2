import { Router } from 'express';
import {
  getUserTickets,
  createTicket,
  getTicket,
  updateTicketStatus,
  getAllTickets,
  addComment,
  getAdminTicket,
} from '../controllers/ticket.controller';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken);

router.get('/my', getUserTickets);
router.post('/', createTicket);
router.get('/:id', getTicket);
router.patch('/:id', requireAdmin, updateTicketStatus);
router.get('/', requireAdmin, getAllTickets);
router.post('/:ticketId/comments', addComment);
router.get('/admin/:id', requireAdmin, getAdminTicket);  // Admin sees ALL tickets

export default router;
