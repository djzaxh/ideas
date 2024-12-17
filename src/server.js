const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3001;
const SECRET_KEY = 'your_secret_key'; // Replace with a secure key in production

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database setup
const db = new sqlite3.Database('./tasks.db');

// Create tables if they don't exist
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )
`);
db.run(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    content TEXT,
    category TEXT,
    completed BOOLEAN DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )
`);

// Register endpoint
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run(
    `INSERT INTO users (username, password) VALUES (?, ?)`,
    [username, hashedPassword],
    function (err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ error: 'Username already exists' });
        }
        return res.status(500).json({ error: 'Registration failed' });
      }
      res.status(201).json({ message: 'User registered successfully' });
    }
  );
});

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
    if (err || !user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  });
});

// Middleware to authenticate token
function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ error: 'Token required' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.userId = user.userId;
    next();
  });
}

// Task management endpoints (authenticated)
app.post('/tasks', authenticateToken, (req, res) => {
  const { content, category } = req.body;
  const userId = req.userId;

  db.run(
    `INSERT INTO tasks (user_id, content, category) VALUES (?, ?, ?)`,
    [userId, content, category],
    function (err) {
      if (err) return res.status(500).json({ error: 'Failed to add task' });
      res.status(201).json({ id: this.lastID, content, category, completed: false });
    }
  );
});

app.get('/tasks', authenticateToken, (req, res) => {
  const userId = req.userId;

  db.all(`SELECT * FROM tasks WHERE user_id = ?`, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to retrieve tasks' });
    res.json(rows);
  });
});

app.put('/tasks/:id', authenticateToken, (req, res) => {
  const taskId = req.params.id;
  const userId = req.userId;

  db.run(
    `UPDATE tasks SET completed = NOT completed WHERE id = ? AND user_id = ?`,
    [taskId, userId],
    function (err) {
      if (err || this.changes === 0) return res.status(500).json({ error: 'Failed to update task' });
      res.json({ message: 'Task updated successfully' });
    }
  );
});

app.delete('/tasks/:id', authenticateToken, (req, res) => {
  const taskId = req.params.id;
  const userId = req.userId;

  db.run(
    `DELETE FROM tasks WHERE id = ? AND user_id = ?`,
    [taskId, userId],
    function (err) {
      if (err || this.changes === 0) return res.status(500).json({ error: 'Failed to delete task' });
      res.json({ message: 'Task deleted successfully' });
    }
  );
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
