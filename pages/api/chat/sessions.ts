// pages/api/chat/sessions.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabaseClient';

interface UnreadCountMap {
    [key: number]: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    // Fetch chat sessions
    const { data: chatSessions, error: chatSessionsError } = await supabase
        .from('chat_sessions')
        .select('*')
        .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
        .order('created_at', {ascending: false});

    if (chatSessionsError) {
        return res.status(500).json({ error: 'Error fetching chat sessions' });
    }

    // Fetch unread message counts
    const { data: unreadMessages, error: unreadMessagesError } = await supabase
        .from('unread_messages')
        .select('chat_session_id, unread_count')
        .eq('user_id', userId);

    if (unreadMessagesError) {
        return res.status(500).json({ error: 'Error fetching unread messages' });
    }

    const unreadCounts = unreadMessages.reduce<UnreadCountMap>((acc, unread) => {
        acc[unread.chat_session_id] = unread.unread_count;
        return acc;
    }, {});

    res.status(200).json({ chatSessions, unreadCounts });
}