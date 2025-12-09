import { Request, Response } from 'express';
import { Ticket, Comment, User } from '../models';
import { io } from '../sockets/ticket.sockets';



export const getUserTickets = async (req: Request, res: Response) => {
  const authReq = req as Request & { user?: { id: number } };

  const tickets = await Ticket.findAll({
    where: { userId: authReq.user!.id },
    order: [['createdAt', 'DESC']],
  });
  res.json(tickets);
};

export const createTicket = async (req: Request, res: Response) => {
  const authReq = req as Request & { user?: { id: number } };

  const ticket = await Ticket.create({
    ...req.body,
    userId: authReq.user!.id,
  });

  io.emit('ticketCreated', ticket);
  res.status(201).json(ticket);
};

export const getTicket = async (req: Request, res: Response) => {
  
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

export const updateTicketStatus = async (req: Request, res: Response) => {
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

export const getAllTickets = async (req: Request, res: Response) => {
  const tickets = await Ticket.findAll({
    include: [{ model: User }],
    order: [['createdAt', 'DESC']],
  });
  res.json(tickets);
};

export const addComment = async (req: Request, res: Response) => {
  const authReq = req as Request & { user?: { id: number } };

  const { ticketId } = req.params as { ticketId: string };

  if (!ticketId) {
    return res.status(400).json({ error: 'ticketId is required' });
  }

  const { content } = req.body;

  const comment = await Comment.create({
    ticketId: +ticketId,
    userId: authReq.user!.id,
    content,
  });

  const fullComment = await Comment.findByPk(comment.id, {
    include: [User],
  });

  io.to(`ticket_${ticketId}`).emit('newComment', fullComment);
  res.status(201).json(fullComment);
};
