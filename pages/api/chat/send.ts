// pages/api/chat/send.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabaseClient';

export default async function sendMessage(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { chatSessionId, userId, newMessage } = req.body;

  const { data, error } = await supabase
    .from('messages')
    .insert([{ chat_session_id: chatSessionId, sender_id: userId, message: newMessage }])
    .single();

  if (error) return res.status(400).json({ error });

  res.status(201).json(data);
}