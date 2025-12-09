import { Server, Socket } from 'socket.io';

let io: Server;

export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: { origin: process.env.FRONTEND_URL, methods: ["GET", "POST"] }
  });

  io.on('connection', (socket: Socket) => {
    console.log('User connected:', socket.id);

    // Join ticket room
    socket.on('joinTicketRoom', (ticketId: string) => {
      socket.join(`ticket_${ticketId}`);
      console.log(`User ${socket.id} joined ticket room: ticket_${ticketId}`);
    });

    // New comment
    socket.on('addComment', async (data: { ticketId: string, content: string }) => {
      // Emit to ticket room
      io.to(`ticket_${data.ticketId}`).emit('newComment', data);
    });

    // Status update
    socket.on('updateStatus', async (data: { ticketId: string, status: string }) => {
      io.to(`ticket_${data.ticketId}`).emit('ticketStatusUpdated', data);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};

export { io };
