import { Request, Response } from 'express';
import { Ticket } from '../models';



export const getStats = async (req: Request, res: Response) => {
  const [total, open, resolved] = await Promise.all([
    Ticket.count(),
    Ticket.count({ where: { status: 'open' } }),
    Ticket.count({ where: { status: 'resolved' } }),
  ]);

  res.json([{ total, open, resolved }]);
};
