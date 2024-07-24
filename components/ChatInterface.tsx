// components/ChatInterface.tsx
"use client";
import React, { useState, useEffect } from 'react';
import Chat from './Chat';
import ChatList from './ChatList';
import styles from './ChatInterface.module.css';
import { useSearchParams } from 'next/navigation';

const ChatInterface = () => {
  const [chatSessionId, setChatSessionId] = useState<number | null>(null);
  const searchParams = useSearchParams();
  
  useEffect(()=>{
    const chatSessionIdParam = searchParams?.get('chatSessionId');
    if(chatSessionIdParam){
      setChatSessionId(Number(chatSessionIdParam));
    }
  }, [searchParams])

  return (
    <div className={styles.chatInterfaceContainer}>
      <ChatList selectedChat={chatSessionId} />
      {chatSessionId ? <Chat chatSessionId={chatSessionId} /> : null}
    </div>
  );
};

export default ChatInterface;