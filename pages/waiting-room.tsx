// pages/waiting-room.tsx
"use client";
import withAuth from '@/components/withAuth';
import WaitingRoom from '../components/WaitingRoom';

const WaitingRoomPage = () => {
  return <WaitingRoom />;
};

export default withAuth(WaitingRoomPage, true);