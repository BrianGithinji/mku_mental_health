import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

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
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { firstName, lastName, email, studentId, course, gender, password } = JSON.parse(event.body);

    const client = await connectToDatabase();
    const db = client.db('mental_health');

    const existingUser = await db.collection('users').findOne({
      $or: [{ email }, { student_id: studentId }]
    });
    
    if (existingUser) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'User already exists' })
      };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await db.collection('users').insertOne({
      first_name: firstName,
      last_name: lastName,
      email,
      student_id: studentId,
      course,
      gender,
      password_hash: passwordHash,
      created_at: new Date()
    });

    const newUser = await db.collection('users').findOne(
      { _id: result.insertedId },
      { projection: { password_hash: 0 } }
    );

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ success: true, user: newUser })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};