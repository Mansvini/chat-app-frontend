import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../../../lib/supabaseClient';

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { username, password } = req.body;

  if (!username || !password) return res.status(400).json({ message: 'Missing username or password' });

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single();

  if (error) return res.status(400).json({ message: 'User not found' });

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, username: user.username, firstName: user.first_name, lastName: user.last_name }, process.env.JWT_SECRET!, { expiresIn: '1h' });

  res.status(200).json({ token });
}