import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabaseClient';
import { getInitials } from '../../../lib/getInitials';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ error: 'Chat session ID is required' });
    }

    const { data: chatSession, error: chatSessionError } = await supabase
        .from('chat_sessions')
        .select('user1_id , user2_id')
        .eq('id', id)
        .single();

    if (chatSessionError || !chatSession) {
        return res.status(404).json({ error: 'Chat session not found' });
    }
    
    const { user1_id, user2_id } = chatSession;

    const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, first_name, last_name')
        .in('id', [user1_id, user2_id]);
        
    if (usersError || !users || users.length !== 2) {
        return res.status(404).json({ error: 'One or both users not found' });
    }

    // Map users to their respective IDs
    const userMap = users.reduce((acc, user) => {
        acc[user.id] = { 
            first_name: user.first_name, 
            last_name: user.last_name, 
            initials: getInitials(user.first_name) + getInitials(user.last_name) 
        };
        return acc;
    }, {} as Record<number, { first_name: string, last_name: string, initials: string }>);

    res.status(200).json({ userMap });
}