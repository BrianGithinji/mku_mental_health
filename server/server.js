import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let db;

// MongoDB connection
MongoClient.connect(process.env.MONGODB_URI)
  .then(client => {
    console.log('Connected to MongoDB Atlas');
    db = client.db();
  })
  .catch(error => console.error('MongoDB connection error:', error));

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { firstName, lastName, email, studentId, course, gender, password } = req.body;

    const existingUser = await db.collection('users').findOne({
      $or: [{ email }, { student_id: studentId }]
    });
    
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
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

    res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password_hash, ...userWithoutPassword } = user;

    res.json({ success: true, token, user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mood Routes
app.get('/api/data/mood', async (req, res) => {
  try {
    const userId = req.headers['user-id'];
    const moodEntries = await db.collection('mood_entries')
      .find({ user_id: userId })
      .sort({ date: -1 })
      .toArray();
    res.json(moodEntries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/data/mood', async (req, res) => {
  try {
    const userId = req.headers['user-id'];
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
});

// Goals Routes
app.get('/api/data/goals', async (req, res) => {
  try {
    const userId = req.headers['user-id'];
    const goals = await db.collection('goals')
      .find({ user_id: userId })
      .sort({ created_at: -1 })
      .toArray();
    res.json(goals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/data/goals', async (req, res) => {
  try {
    const userId = req.headers['user-id'];
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
});

app.put('/api/data/goals', async (req, res) => {
  try {
    const userId = req.headers['user-id'];
    const { goalId, progress } = req.body;
    
    const goal = await db.collection('goals').findOne({ _id: new ObjectId(goalId), user_id: userId });
    
    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    const completed = progress >= goal.target;
    await db.collection('goals').updateOne(
      { _id: new ObjectId(goalId), user_id: userId },
      { $set: { progress, completed } }
    );

    const updatedGoal = await db.collection('goals').findOne({ _id: new ObjectId(goalId) });
    res.json(updatedGoal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Journal Routes
app.get('/api/data/journal', async (req, res) => {
  try {
    const userId = req.headers['user-id'];
    const journalEntries = await db.collection('journal_entries')
      .find({ user_id: userId })
      .sort({ date: -1 })
      .toArray();
    res.json(journalEntries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/data/journal', async (req, res) => {
  try {
    const userId = req.headers['user-id'];
    const { title, content, mood, tags } = req.body;
    
    const result = await db.collection('journal_entries').insertOne({
      user_id: userId,
      title,
      content,
      mood,
      tags,
      date: new Date().toISOString().split('T')[0],
      created_at: new Date()
    });
    
    const newEntry = await db.collection('journal_entries').findOne({ _id: result.insertedId });
    res.status(201).json(newEntry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});