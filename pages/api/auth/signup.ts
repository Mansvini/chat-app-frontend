import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabaseClient';
import bcrypt from 'bcryptjs';

export default async function signup(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { username, password, firstName, lastName } = req.body;

  if (!username || !password || !firstName || !lastName) return res.status(400).json({ message: 'Missing required fields' });

  const hashedPassword = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from('users')
    .insert([{ username, password: hashedPassword, first_name: firstName, last_name: lastName }]);

  if (error) return res.status(400).json({ message: error.details });

  res.status(201).json({ message: 'User created successfully' });
}