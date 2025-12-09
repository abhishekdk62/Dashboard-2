import { Router } from 'express';
import {
  getUserTickets,
  createTicket,
  getTicket,
  updateTicketStatus,
  getAllTickets,
  addComment,
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

export default router;
