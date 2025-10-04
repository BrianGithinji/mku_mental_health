import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        student_id VARCHAR(50) UNIQUE NOT NULL,
        course VARCHAR(100) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Create mood_entries table
    await sql`
      CREATE TABLE IF NOT EXISTS mood_entries (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        mood INTEGER NOT NULL CHECK (mood >= 1 AND mood <= 10),
        note TEXT,
        date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Create goals table
    await sql`
      CREATE TABLE IF NOT EXISTS goals (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        progress INTEGER DEFAULT 0,
        target INTEGER NOT NULL,
        category VARCHAR(100),
        deadline DATE,
        completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Create journal_entries table
    await sql`
      CREATE TABLE IF NOT EXISTS journal_entries (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        mood INTEGER CHECK (mood >= 1 AND mood <= 6),
        tags JSONB,
        date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    res.json({ success: true, message: 'Database tables created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}