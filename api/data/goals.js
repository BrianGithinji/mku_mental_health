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
        const goals = await db.collection('goals')
          .find({ user_id: userId })
          .sort({ created_at: -1 })
          .toArray();
        res.json(goals);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;

    case 'POST':
      try {
        const { title, description, target, category, deadline } = req.body;
        const result = await db.collection('goals').insertOne({
          user_id: userId,
          title,
          description,
          progress: 0,
          target,
          category,
          deadline,
          completed: false,
          created_at: new Date()
        });
        
        const newGoal = await db.collection('goals').findOne({ _id: result.insertedId });
        res.status(201).json(newGoal);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;

    case 'PUT':
      try {
        const { goalId, progress } = req.body;
        const goal = await db.collection('goals').findOne({ _id: new ObjectId(goalId), user_id: userId });
        
        if (!goal) {
          return res.status(404).json({ error: 'Goal not found' });
        }

        const completed = progress >= goal.target;
        const result = await db.collection('goals').updateOne(
          { _id: new ObjectId(goalId), user_id: userId },
          { $set: { progress, completed } }
        );

        const updatedGoal = await db.collection('goals').findOne({ _id: new ObjectId(goalId) });
        res.json(updatedGoal);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}