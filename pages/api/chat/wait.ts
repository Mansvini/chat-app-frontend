// pages/api/chat/wait.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabaseClient';

export default async function wait(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).end();
    
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }
    
    // Check for waiting users
    const { data: waitingUsers, error: waitingUsersError } = await supabase
        .from('waiting_users')
        .select('*')
        .order('created_at', { ascending: true });
    
    if (waitingUsersError) return res.status(400).json({ error: waitingUsersError.message });

    for (let i = 0; i < waitingUsers.length; i++) {
        const waitingUser = waitingUsers[i];

        // Check if there's already a chat session between the user and the waiting user
        const { data: existingChatSessions, error: existingChatSessionsError } = await supabase
            .from('chat_sessions')
            .select('*')
            .or(`and(user1_id.eq.${waitingUser.user_id},user2_id.eq.${userId}),and(user1_id.eq.${userId},user2_id.eq.${waitingUser.user_id})`);

        if (existingChatSessionsError) return res.status(400).json({ error: existingChatSessionsError.message });

        if (existingChatSessions.length === 0) {

            // Pair with the waiting user who is not already connected
            const { data: chatSession, error: chatSessionError } = await supabase
                .from('chat_sessions')
                .insert([{ user1_id: waitingUser.user_id, user2_id: userId }])
                .select()
                .single();
        
            if (chatSessionError) return res.status(400).json({ error: chatSessionError.message });
        
            // Remove the paired user from the waiting list
            await supabase.from('waiting_users').delete().eq('user_id', waitingUser.user_id);
        
            return res.status(201).json(chatSession);
        }
    }

    // Add the user to the waiting list if no suitable match is found
    const { data, error } = await supabase.from('waiting_users').insert([{ user_id: userId }]).single();

    if (error) return res.status(400).json({ error });

    return res.status(201).json(data);
}