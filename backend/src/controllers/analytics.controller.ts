import { Request, Response } from 'express';
import { Ticket } from '../models';

interface AuthRequest extends Request {
  user?: { id: number; email: string; role: 'user' | 'admin' };
}

export const getStats = async (req: AuthRequest, res: Response) => {
  const [total, open, resolved] = await Promise.all([
    Ticket.count(),
    Ticket.count({ where: { status: 'open' } }),
    Ticket.count({ where: { status: 'resolved' } }),
  ]);

  res.json([{ total, open, resolved }]);
};
