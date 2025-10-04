import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const { method } = req;
  const userId = req.headers['user-id'];

  if (!userId) {
    return res.status(401).json({ error: 'User ID required' });
  }

  const client = await clientPromise;
  const db = client.db('mental_health');

  switch (method) {
    case 'GET':
      try {
        const moodEntries = await db.collection('mood_entries')
          .find({ user_id: userId })
          .sort({ date: -1 })
          .toArray();
        res.json(moodEntries);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;

    case 'POST':
      try {
        const { mood, note, date } = req.body;
        const result = await db.collection('mood_entries').insertOne({
          user_id: userId,
          mood,
          note: note || '',
          date: date || new Date().toISOString().split('T')[0],
          created_at: new Date()
        });
        
        const newEntry = await db.collection('mood_entries').findOne({ _id: result.insertedId });
        res.status(201).json(newEntry);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}