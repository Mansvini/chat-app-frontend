import { io } from 'socket.io-client';

const URL = process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_BACKEND_URL : process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL;

export const socket = io(
    URL || '',
    {autoConnect: false}
);
