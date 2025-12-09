import { Request, Response } from 'express';
import { createClient } from 'redis';
import { Ticket, Comment, User } from '../models';
import { io } from '../sockets/ticket.sockets';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});
redisClient.connect();

export const getAdminTicket = async (req: Request, res: Response) => {
  console.log('yeah');

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
      include: [{ model: User, as: 'User' }],
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

    // ✅ Cache ticket in Redis for 1 hour
    await redisClient.setEx(`ticket:${ticket.id}`, 3600, JSON.stringify(ticket.toJSON()));

    // ✅ Notify ALL ADMINS
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

    // ✅ Check Redis cache first
    const cached = await redisClient.get(`ticket:${req.params.id}`);
    if (cached) {
      const ticket = JSON.parse(cached);
      if (ticket.userId === authReq.user!.id) {
        return res.json(ticket);
      }
    }

    const ticket = await Ticket.findOne({
      where: { 
        id: req.params.id, 
        userId: authReq.user!.id
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

    // ✅ Cache for 30 minutes
    await redisClient.setEx(`ticket:${ticket.id}`, 1800, JSON.stringify(ticket.toJSON()));
    
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
    
    // ✅ Invalidate Redis cache
    await redisClient.del(`ticket:${req.params.id}`);
    
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

export const getAllTickets = async (req: Request, res: Response) => {
  try {
    // ✅ Check Redis cache for all tickets
    const cached = await redisClient.get('all_tickets');
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const tickets = await Ticket.findAll({
      include: [{ model: User, as: 'User' }],
      order: [['createdAt', 'DESC']],
    });

    // ✅ Cache all tickets for 5 minutes
    await redisClient.setEx('all_tickets', 300, JSON.stringify(tickets.map(t => t.toJSON())));
    
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
};

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

    // ✅ Invalidate ticket cache when new comment added
    await redisClient.del(`ticket:${ticketId}`);

    io.to(`ticket_${ticketId}`).emit('newComment', fullComment);

    res.status(201).json(fullComment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add comment' });
  }
};
