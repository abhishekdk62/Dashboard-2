import { Request, Response } from 'express';
import { Ticket, Comment, User } from '../models';
import { io } from '../sockets/ticket.sockets';
export const getAdminTicket = async (req: Request, res: Response) => {
console.log('yeag');

  const ticket = await Ticket.findByPk(req.params.id, {
    include: [
      { model: Comment, include: [User], order: [['createdAt', 'ASC']] },
      { model: User, as: 'User' },
    ],
  });

  if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
  res.json(ticket);
};

export const getUserTickets = async (req: Request, res: Response) => {
  try {
    const authReq = req as Request & { user?: { id: number } };

    const tickets = await Ticket.findAll({
      where: { userId: authReq.user!.id },
      order: [['createdAt', 'DESC']],
      include: [{ model: User, as: 'User' }], // Include user info
    });
    
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
};

export const createTicket = async (req: Request, res: Response) => {
  try {
    const authReq = req as Request & { user?: { id: number } };

    const ticket = await Ticket.create({
      ...req.body,
      userId: authReq.user!.id,
    });

    // ✅ Notify ALL ADMINS (not all users)
    io.emit('ticketCreated', { 
      ...ticket.toJSON(), 
      User: authReq.user 
    });

    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create ticket' });
  }
};

export const getTicket = async (req: Request, res: Response) => {
  try {
    const authReq = req as Request & { user?: { id: number } };

    const ticket = await Ticket.findOne({
      where: { 
        id: req.params.id, 
        userId: authReq.user!.id  // ✅ User's own ticket ONLY
      },
      include: [
        {
          model: Comment,
          include: [User],
          order: [['createdAt', 'ASC']],
        },
        { model: User, as: 'User' },
      ],
    });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found or access denied' });
    }
    
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ticket' });
  }
};

export const updateTicketStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const ticket = await Ticket.findByPk(req.params.id);

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    await ticket.update({ status });
    
    // ✅ Emit to SPECIFIC ticket room
    io.to(`ticket_${req.params.id}`).emit('ticketStatusUpdated', {
      id: ticket.id,
      status: status,
    });

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status' });
  }
};

// ✅ 5. Get All Tickets (ADMIN ONLY)
export const getAllTickets = async (req: Request, res: Response) => {
  try {
    const tickets = await Ticket.findAll({
      include: [{ model: User, as: 'User' }],
      order: [['createdAt', 'DESC']],
    });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
};

// ✅ 6. Add Comment (BOTH user/admin)
export const addComment = async (req: Request, res: Response) => {
  try {
    const authReq = req as Request & { user?: { id: number } };
    const { ticketId } = req.params as { ticketId: string };
    const { content } = req.body;

    if (!ticketId || !content || content.trim().length < 3) {
      return res.status(400).json({ error: 'Valid ticketId and content (min 3 chars) required' });
    }

    const comment = await Comment.create({
      ticketId: +ticketId,
      userId: authReq.user!.id,
      content: content.trim(),
    });

    const fullComment = await Comment.findByPk(comment.id, {
      include: [User],
    });

    io.to(`ticket_${ticketId}`).emit('newComment', fullComment);

    res.status(201).json(fullComment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add comment' });
  }
};
