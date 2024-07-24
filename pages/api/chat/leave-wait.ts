// pages/api/chat/leave-wait.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabaseClient';

export default async function leaveWait(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { userId } = req.body;

  const { error } = await supabase.from('waiting_users').delete().eq('user_id', userId);

  if (error) return res.status(400).json({ error });

  res.status(200).json({ message: 'Removed from waiting list' });
}