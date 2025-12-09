import { Request, Response } from 'express';
import { Ticket, Comment, User } from '../models';
import { io } from '../sockets/ticket.sockets';

interface AuthRequest extends Request {
  user?: { id: number; email: string; role: 'user' | 'admin' };
}

export const getUserTickets = async (req: AuthRequest, res: Response) => {
  const tickets = await Ticket.findAll({
    where: { userId: req.user!.id },
    order: [['createdAt', 'DESC']],
  });
  res.json(tickets);
};

export const createTicket = async (req: AuthRequest, res: Response) => {
  const ticket = await Ticket.create({
    ...req.body,
    userId: req.user!.id,
  });

  io.emit('ticketCreated', ticket);
  res.status(201).json(ticket);
};

export const getTicket = async (req: AuthRequest, res: Response) => {
  const ticket = await Ticket.findByPk(req.params.id, {
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
    return res.status(404).json({ error: 'Ticket not found' });
  }
  res.json(ticket);
};

export const updateTicketStatus = async (req: AuthRequest, res: Response) => {
  const { status } = req.body;
  const ticket = await Ticket.findByPk(req.params.id);

  if (!ticket) {
    return res.status(404).json({ error: 'Ticket not found' });
  }

  await ticket.update({ status });
  
  io.to(`ticket_${req.params.id}`).emit('ticketStatusUpdated', {
    id: ticket.id,
    status,
  });

  res.json(ticket);
};

export const getAllTickets = async (req: AuthRequest, res: Response) => {
  const tickets = await Ticket.findAll({
    include: [{ model: User }],
    order: [['createdAt', 'DESC']],
  });
  res.json(tickets);
};

export const addComment = async (req: AuthRequest, res: Response) => {
  const { content } = req.body;
  const comment = await Comment.create({
    ticketId: +req.params.ticketId,
    userId: req.user!.id,
    content,
  });

  const fullComment = await Comment.findByPk(comment.id, {
    include: [User],
  });

  io.to(`ticket_${req.params.ticketId}`).emit('newComment', fullComment);
  res.status(201).json(fullComment);
};
