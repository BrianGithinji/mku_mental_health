const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }
  
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not set');
  }
  
  console.log('Connecting to MongoDB with URI:', process.env.MONGODB_URI.substring(0, 20) + '...');
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  console.log('Connected to MongoDB successfully');
  cachedClient = client;
  return client;
}

exports.handler = async (event, context) => {
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
      body: JSON.stringify({ message: 'Auth register endpoint is working. Use POST to register.' })
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
    console.log('Registration request received');
    console.log('Event body:', event.body);
    
    if (!event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Request body is required' })
      };
    }
    
    const { firstName, lastName, email, studentId, course, gender, password } = JSON.parse(event.body);
    console.log('Parsed request data:', { firstName, lastName, email, studentId, course, gender });
    
    if (!firstName || !lastName || !email || !studentId || !password) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    const client = await connectToDatabase();
    const db = client.db('mental_health');

    console.log('Checking for existing user...');
    const existingUser = await db.collection('users').findOne({
      $or: [{ email }, { student_id: studentId }]
    });
    console.log('Existing user check result:', existingUser ? 'User exists' : 'User does not exist');
    
    if (existingUser) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'User already exists' })
      };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    console.log('Inserting new user...');
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
    console.log('User inserted with ID:', result.insertedId);

    const newUser = await db.collection('users').findOne(
      { _id: result.insertedId },
      { projection: { password_hash: 0 } }
    );

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({ success: true, user: newUser })
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message, stack: error.stack })
    };
  }
};