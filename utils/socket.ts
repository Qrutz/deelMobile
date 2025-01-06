// socket.ts
import { io } from 'socket.io-client';

// Replace with your server's actual URL
const SOCKET_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000';

const socket = io(SOCKET_URL, {
  autoConnect: false, // Don't auto-connect immediately
  reconnection: true, // Automatically reconnect on disconnect
  reconnectionAttempts: 5, // Try 5 times before giving up
  reconnectionDelay: 1000, // Wait 1 second between reconnection attempts
});

export default socket;
