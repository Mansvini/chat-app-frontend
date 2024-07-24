// pages/api/chat/messages.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabaseClient';

export default async function fetchMessages(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();

  const { chatSessionId } = req.query;

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('chat_session_id', chatSessionId)
    .order('created_at', { ascending: true });

  if (error) return res.status(400).json({ error });

  res.status(200).json(data);
}