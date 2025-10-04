import clientPromise from '../../lib/mongodb';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { firstName, lastName, email, studentId, course, password } = req.body;

  try {
    const client = await clientPromise;
    const db = client.db('mental_health');

    // Check if user exists
    const existingUser = await db.collection('users').findOne({
      $or: [{ email }, { student_id: studentId }]
    });
    
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert user
    const result = await db.collection('users').insertOne({
      first_name: firstName,
      last_name: lastName,
      email,
      student_id: studentId,
      course,
      password_hash: passwordHash,
      created_at: new Date()
    });

    const newUser = await db.collection('users').findOne(
      { _id: result.insertedId },
      { projection: { password_hash: 0 } }
    );

    res.status(201).json({ 
      success: true, 
      user: newUser 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}