import { MongoClient } from 'mongodb';

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }
  
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  cachedClient = client;
  return client;
}

export const handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, user-id',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const userId = event.headers['user-id'];
    const client = await connectToDatabase();
    const db = client.db('mental_health');

    if (event.httpMethod === 'GET') {
      const moodEntries = await db.collection('mood_entries')
        .find({ user_id: userId })
        .sort({ date: -1 })
        .toArray();
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(moodEntries)
      };
    }

    if (event.httpMethod === 'POST') {
      const { mood, note, date } = JSON.parse(event.body);
      
      const result = await db.collection('mood_entries').insertOne({
        user_id: userId,
        mood,
        note: note || '',
        date: date || new Date().toISOString().split('T')[0],
        created_at: new Date()
      });
      
      const newEntry = await db.collection('mood_entries').findOne({ _id: result.insertedId });
      
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(newEntry)
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};