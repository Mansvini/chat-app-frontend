// components/SocketManager.tsx
"use client";
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { socket } from '../socket';

const SocketManager = () => {
  const { userId } = useAuth();

  useEffect(() => {
    if (userId) {
      socket.auth = { userId };
      socket.connect();

      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }

    return () => {
      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, [userId]);

  return null;
};

export default SocketManager;