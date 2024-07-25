// components/Chat.tsx
"use client";
import { useState, useEffect, useRef } from 'react';
import styles from './Chat.module.css';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import {socket} from '../socket';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import {utcToLocal} from '../lib/utcToLocal';

interface Message {
  id: number | string;
  sender_id: number;
  message: string;
  created_at: Date | string;
  chat_session_id: number;
}

interface userName {
  first_name: string,
  last_name: string, 
  initials: string
}

const Chat = ({ chatSessionId }: { chatSessionId: number }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const { userId } = useAuth();
  const router  = useRouter();
  const [typingUsers, setTypingUsers] = useState<Set<number>>(new Set());
  const [users, setUsers] = useState<{ [user_id: number]: userName }>({});
  const [recepientId, setRecepientId] = useState<number>();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(()=>{
    scrollToBottom()
  },[messages, typingUsers]);

  useEffect(()=>{

    if (chatSessionId) {
      fetchChatUsers(chatSessionId);
      fetchMessages();
    }

    const handleReceiveMessage = (message: Message) => {
      if(message.chat_session_id == chatSessionId){
        setMessages((prevMessages) => [...prevMessages, message]);
      }
      //TODO: add sound & permanent notification as header link in chat
      // if (document.hidden) { shift to app
      //   new Notification('New message', {
      //     body: message.message,
      //   });
      // }
    };

    const handleUserTyping = (userId: number, chatId: number) => {
      if(chatId == chatSessionId){
        setTypingUsers((prevTypingUsers) => new Set(prevTypingUsers).add(userId));
      }
    };

    const handleUserStoppedTyping = (userId: number, chatId: number) => {
      if(chatId == chatSessionId){
        setTypingUsers((prevTypingUsers) => {
          const newTypingUsers = new Set(prevTypingUsers);
          newTypingUsers.delete(userId);
          return newTypingUsers;
        });
      }
    };

    socket.on('receiveMessage', handleReceiveMessage);
    socket.on('userTyping', handleUserTyping);
    socket.on('userStoppedTyping', handleUserStoppedTyping);

    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
      socket.off('userTyping', handleUserTyping);
      socket.off('userStoppedTyping', handleUserStoppedTyping);
    };

  }, [chatSessionId])

  useEffect(()=>{
    setRecepientId(Number(Object.keys(users).find(id => (Number(id) !== userId))));
  }, [users])

  const fetchMessages = async () => {
    const res = await fetch(`/api/chat/messages?chatSessionId=${chatSessionId}`);
    const data = await res.json();
    setMessages(data);
    setLoading(false);
  };

  const fetchChatUsers = async (id: number) => {
    if(userId){
      const res = await fetch(`/api/chat/users?id=${id}`);
      if(res.ok){
        const { userMap } = await res.json();
        if(!Object.keys(userMap).includes(userId.toString())){
          router.push('/error');
        }else{
          setUsers(userMap);
        }
      }
    }
  };

  const handleSendMessage = async () => {

    socket.emit('stopTyping', chatSessionId, userId);

    if(userId && newMessage.length){
      const res = await fetch('/api/chat/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chatSessionId, userId, newMessage }),
      });

      if (res.ok) {
        const message = {
          id: new Date() + Math.random().toString() + userId, //temporary unique id for key
          message: newMessage,
          sender_id: userId,
          chat_session_id: chatSessionId,
          created_at: new Date().toISOString(),
        }
        setMessages((prevMessages) => [...prevMessages, message]);
        socket.emit('sendMessage', { message, recepientId });
        setNewMessage('');
      }
    }
  };

  const handleTyping = () => {
    socket.emit('typing', chatSessionId, userId, recepientId);
  };

  const handleStopTyping = () => {
    socket.emit('stopTyping', chatSessionId, userId, recepientId);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleStopTyping();
      handleSendMessage();
    } else {
      handleTyping();
      if (e.key === 'Enter' && e.shiftKey) {
        e.preventDefault();
        setNewMessage((prev) => prev + '\n');
      }
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' }); //not going to bottom
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messages}>
        {messages.length ? messages.map((msg) => (
          <div
            key={msg.id} 
            className={`${styles.message} ${msg.sender_id === userId ? styles.myMessage : styles.theirMessage}`}
          >
            <Avatar>
              <AvatarImage src={`https://robohash.org/${msg.sender_id}?20x20`} />
              <AvatarFallback>{users[msg.sender_id]?.initials}</AvatarFallback>
            </Avatar>
            <div className={styles.messsageContent}>
              <div className={styles.messageText}>{msg.message}</div>
              <div className={styles.messageTime}>{new Date(msg.created_at).toLocaleTimeString()}</div>
            </div>
          </div>
        )) : null}
        {Array.from(typingUsers).length > 0 ?
          Array.from(typingUsers).map((typingUserId)=> <div key={typingUserId}>{typingUserId == userId ? "You are typing ..." : users[typingUserId].first_name + ' is typing...'} </div>)
        : null}
        <div ref={messagesEndRef}></div>
      </div>
      <div className={styles.inputContainer}>
        <Textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={handleKeyPress}
          onBlur={handleStopTyping}
        />
        <Button onClick={handleSendMessage}>Send</Button>
      </div>
    </div>
  );
};

export default Chat;