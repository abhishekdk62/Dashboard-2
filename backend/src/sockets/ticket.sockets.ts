import { Server, Socket } from 'socket.io';

export let io: Server;

export const initSockets = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log('User connected:', socket.id);

    socket.on('joinTicket', (ticketId: number) => {
      socket.join(`ticket_${ticketId}`);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};
