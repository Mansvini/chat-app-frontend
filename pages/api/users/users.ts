// pages/api/users/users.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { ids } = req.query;

  if (!ids) {
    return res.status(400).json({ error: 'User IDs are required' });
  }

  const idsArray = typeof ids === 'string' ? ids.split(',') : [];

  const { data: users, error } = await supabase
    .from('users')
    .select('id, first_name, last_name')
    .in('id', idsArray);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json(users);
}