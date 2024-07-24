// pages/chats.tsx
"use client";
import React from 'react';
import ChatInterface from '../components/ChatInterface';
import withAuth from '@/components/withAuth';

const ChatPage = () => {
  return (
    <ChatInterface />
  );
};

export default withAuth(ChatPage, true);
