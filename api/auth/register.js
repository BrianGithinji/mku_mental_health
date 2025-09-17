import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { firstName, lastName, email, studentId, course, password } = req.body;

  try {
    // Check if user exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email} OR student_id = ${studentId}
    `;
    
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert user
    const result = await sql`
      INSERT INTO users (first_name, last_name, email, student_id, course, password_hash)
      VALUES (${firstName}, ${lastName}, ${email}, ${studentId}, ${course}, ${passwordHash})
      RETURNING id, first_name, last_name, email, student_id, course
    `;

    res.status(201).json({ 
      success: true, 
      user: result.rows[0] 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}