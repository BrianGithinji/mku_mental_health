import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Auth login endpoint is working. Use POST to login.' })
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { email, password } = JSON.parse(event.body);

    const client = await connectToDatabase();
    const db = client.db('mental_health');

    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid credentials' })
      };
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid credentials' })
      };
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password_hash, ...userWithoutPassword } = user;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, token, user: userWithoutPassword })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};