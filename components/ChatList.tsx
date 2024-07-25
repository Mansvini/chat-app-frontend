// components/ChatList.tsx
"use client";

import React, {useEffect, useState} from 'react';
import styles from './ChatList.module.css';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import {useToast} from './ui/use-toast';
import {socket} from '../socket';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

interface ChatSession {
  id: number;
  user1_id: number;
  user2_id: number;
  created_at: Date;
}

const ChatList = ({ selectedChat }: { selectedChat: number | null}) => {
    const [loading, setLoading] = useState(true);
    const [userNames, setUserNames] = useState<{ [key: number]: string }>({});
    const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
    const [newMessageCounts, setNewMessageCounts] = useState<{ [key: number]: number }>({});
    const {toast} = useToast();
    const { userId } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const fetchChatSessions = async (userId: number) => {
            const res = await fetch(`/api/chat/sessions?userId=${userId}`);
    
            if(res.ok){
                const data = await res.json();
                setChatSessions(data.chatSessions);
                setNewMessageCounts(data.unreadCounts);
                data.chatSessions.length && fetchUserNames(data.chatSessions);
                setLoading(false);
            }
        };

        if (userId) {
          fetchChatSessions(userId);
        }
    }, [userId]);

    useEffect(()=>{

        const handleReceiveMessage = async (message: any) => {
          if(selectedChat != message.chat_session_id){
            toast({
              title: userNames[message.sender_id],
              description: message.message
            })
            setNewMessageCounts((prevCounts) => ({
                ...prevCounts,
                [message.chat_session_id]: (prevCounts[message.chat_session_id] || 0) + 1,
            }));
            await fetch(`/api/chat/increment-unread-count`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chatSessionId: message.chat_session_id, userId }),
            }); 
          }
      
          // if (Notification.permission === 'granted' && (!selectedChat || selectedChat !== message.chatSessionId)) {
          //   new Notification('New message', {
          //     body: `${userNames[message.senderId]}: ${message.message}`,
          //     icon: '/path/to/icon.png', // Add your own icon path here
          //   });
          // }
        };
    
        socket.on('receiveMessage', handleReceiveMessage);
    
        return ()=>{
          socket.off('receiveMessage', handleReceiveMessage);
        }
    
    }, [userNames, selectedChat, userId, toast]);

    const fetchUserNames = async (sessions: any[]) => {
        const userIds = Array.from(new Set(sessions?.flatMap(session => [session.user1_id, session.user2_id])));
        const res = await fetch(`/api/users/users?ids=${userIds.join(',')}`);
        const users = await res.json();
        const userMap: { [key: number]: string } = {};
        users?.forEach((user: { id: number, first_name: string, last_name: string }) => {
            userMap[user.id] = `${user.first_name} ${user.last_name}`;
        });
        setUserNames(userMap);
    };

    const onSelectChat = async(id: number) => {
        // Reset unread message count in the database
        if(newMessageCounts[id]){
            await fetch(`/api/chat/reset-unread-count`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chatSessionId: id, userId }),
            });
        }

        // Reset unread message count in the state
        setNewMessageCounts((prevCounts) => ({
            ...prevCounts,
            [id]: 0,
        }));
        router.replace(`/chats?chatSessionId=${id}`)
    };

    const joinWaitingRoom = () => {
        router.push('/waiting-room');
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.chatListContainer}>
            <div className={styles.actions}>
                <Button onClick={joinWaitingRoom}>+ New Chat</Button>
            </div>
            {chatSessions.length ? chatSessions?.map(session => (
                <Card 
                    key={session.id} 
                    className={`${styles.chatSession} ${selectedChat === session.id ? styles.selected : ''}`} 
                    onClick={() => onSelectChat(session.id)}
                >
                    <div className={styles.participants}>
                        {session.user1_id == userId ? userNames[session.user2_id] : userNames[session.user1_id]}
                    </div>
                    {newMessageCounts[session.id] > 0 ? (
                        <Badge>
                            {newMessageCounts[session.id]}
                        </Badge>
                    ) : null}
                </Card>
            )) : null}
        </div>
    );
};

export default ChatList;