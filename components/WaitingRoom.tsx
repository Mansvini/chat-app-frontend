// components/WaitingRoom.tsx
"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import styles from './WaitingRoom.module.css';
import { Button } from './ui/button';
import {socket} from '../socket';

const WaitingRoom = () => {
  const { userId } = useAuth();
  const [waiting, setWaiting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (waiting) {
      const handleStrangerConnected = (chatSessionId: number) => {
        router.push(`/chats?chatSessionId=${chatSessionId}`);
      };

      socket.on('strangerConnected', handleStrangerConnected);

      return (()=>{
        socket.off('strangerConnected', handleStrangerConnected);
      })
    }
  }, [waiting, router]);


  const wait = async () => {
    const res = await fetch('/api/chat/wait', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: userId }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.user1_id && data?.user2_id) {
        setWaiting(false);
        const waitingUserId = data.user1_id == userId ? data.user2_id : data.user1_id;
        socket.emit("joinedRandomChat", waitingUserId, data.id);
        router.push(`/chats?chatSessionId=${data.id}`);
      }
    }
  };

  const handleJoin = async () => {
    setWaiting(true);
    wait();
  };

  const goToChats = () => {
    router.push('/chats');
  }

  const handleLeave = async () => {
    setWaiting(false);
    await fetch('/api/chat/leave-wait', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });
  };

  return (
    <div className={styles.container}>
      <h1>Random Stranger Chat</h1>
      <br/>
      {waiting ? (
        <div>
          <p>Waiting...</p>
          <br/>
          <Button onClick={handleLeave} className={styles.leaveButton}>Leave Waiting Room</Button>
        </div>
        ) : (
          <div>
            <Button onClick={handleJoin} className='me-3'>Join Waiting Room</Button>
            <Button onClick={goToChats} className='ms-3'>Go To Chats</Button>
          </div>
      )}
    </div>
  );
};

export default WaitingRoom;