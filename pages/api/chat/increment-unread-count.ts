// pages/api/chat/increment-unread-count.js
import { NextApiRequest, NextApiResponse } from 'next';
import {supabase} from '../../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { chatSessionId, userId } = req.body;

    // Step 1: Check if the record exists
    const { data: existingRecord, error: selectError } = await supabase
      .from('unread_messages')
      .select('unread_count')
      .eq('chat_session_id', chatSessionId)
      .eq('user_id', userId)
      .single();

    if (selectError) {
      // If there's an error other than 'PGRST116' (record not found), return it
      if (selectError.code !== 'PGRST116') {
        return res.status(500).json({ error: selectError.message });
      }
    }

    if (existingRecord) {
      // Step 2: If the record exists, update it
      const { data, error } = await supabase
        .from('unread_messages')
        .update({ unread_count: existingRecord.unread_count + 1 })
        .eq('chat_session_id', chatSessionId)
        .eq('user_id', userId);

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ data });
    } else {
      // Step 3: If the record does not exist, insert a new one
      const { data, error } = await supabase
        .from('unread_messages')
        .insert({ chat_session_id: chatSessionId, user_id: userId, unread_count: 1 });

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ data });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}