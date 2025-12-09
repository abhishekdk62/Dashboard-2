import { useEffect, useRef, useCallback } from 'react';
import io, { Socket } from 'socket.io-client';
import { Comment } from '../types';

const SOCKET_URL = process.env.REACT_APP_API_URL;

interface SocketCallbacks {
  onNewComment?: (comment: Comment) => void;
  onStatusUpdate?: (data: { id: number; status: string }) => void;
}

export const useSocket = (ticketId?: string, callbacks?: SocketCallbacks) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!ticketId) return;

    // Connect to socket server
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket', 'polling']
    });

    // Join specific ticket room
    socketRef.current.emit('joinTicketRoom', ticketId);
    console.log(`✅ Joined room: ticket_${ticketId}`);

    // Listen for new comments
    if (callbacks?.onNewComment) {
      socketRef.current.on('newComment', callbacks.onNewComment);
    }

    // Listen for status updates
    if (callbacks?.onStatusUpdate) {
      socketRef.current.on('ticketStatusUpdated', callbacks.onStatusUpdate);
    }

    return () => {
      socketRef.current?.off('newComment');
      socketRef.current?.off('ticketStatusUpdated');
      socketRef.current?.disconnect();
    };
  }, [ticketId, callbacks]);

  return socketRef.current;
};
