import { io } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || '';

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
  transports: ['websocket', 'polling'],
  withCredentials: true,
});

// Debug logging
socket.on('connect', () => {
  console.log('🟢 Socket connected:', socket.id);
});

socket.on('connect_error', (error) => {
  console.error('🔴 Socket connection error:', error);
});

socket.on('disconnect', (reason) => {
  console.log('🔴 Socket disconnected:', reason);
});
