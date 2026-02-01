import express from 'express'
import cors from 'cors'
import Database from 'better-sqlite3'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = 3001
const JWT_SECRET = 'lms-secret-key-change-in-production'

// Initialize database
const db = new Database(join(__dirname, 'database.sqlite'))

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'student',
    avatar TEXT,
    bio TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

// Seed admin user if not exists
const adminExists = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@lms.com')
if (!adminExists) {
  const hashedPassword = bcrypt.hashSync('admin123', 10)
  db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)').run(
    'Admin User',
    'admin@lms.com',
    hashedPassword,
    'admin'
  )
  console.log('Admin user created: admin@lms.com / admin123')
}

// Middleware
app.use(cors())
app.use(express.json())

// Auth middleware
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

// Helper to format user response
function formatUser(user) {
  return {
    id: String(user.id),
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    bio: user.bio,
    createdAt: user.created_at
  }
}

// Routes

// Register
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role = 'student' } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' })
  }

  const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email)
  if (existingUser) {
    return res.status(400).json({ message: 'Email already registered' })
  }

  const hashedPassword = bcrypt.hashSync(password, 10)
  const result = db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)').run(
    name,
    email,
    hashedPassword,
    role === 'instructor' ? 'instructor' : 'student'
  )

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid)
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' })

  res.json({ user: formatUser(user), token })
})

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email)
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' })
  }

  const validPassword = bcrypt.compareSync(password, user.password)
  if (!validPassword) {
    return res.status(401).json({ message: 'Invalid email or password' })
  }

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' })

  res.json({ user: formatUser(user), token })
})

// Get current user
app.get('/api/auth/me', authenticate, (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id)
  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }
  res.json(formatUser(user))
})

// Update profile
app.put('/api/auth/profile', authenticate, (req, res) => {
  const { name, bio, avatar } = req.body
  
  db.prepare('UPDATE users SET name = COALESCE(?, name), bio = COALESCE(?, bio), avatar = COALESCE(?, avatar) WHERE id = ?').run(
    name,
    bio,
    avatar,
    req.user.id
  )

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id)
  res.json(formatUser(user))
})

// Admin: Get all users
app.get('/api/admin/users', authenticate, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' })
  }

  const users = db.prepare('SELECT * FROM users ORDER BY created_at DESC').all()
  res.json(users.map(formatUser))
})

// Admin: Create user
app.post('/api/admin/users', authenticate, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' })
  }

  const { name, email, password, role = 'student' } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' })
  }

  const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email)
  if (existingUser) {
    return res.status(400).json({ message: 'Email already registered' })
  }

  const hashedPassword = bcrypt.hashSync(password, 10)
  const result = db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)').run(
    name,
    email,
    hashedPassword,
    role
  )

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid)
  res.json(formatUser(user))
})

// Admin: Update user
app.put('/api/admin/users/:id', authenticate, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' })
  }

  const { name, email, role } = req.body
  const { id } = req.params

  db.prepare('UPDATE users SET name = COALESCE(?, name), email = COALESCE(?, email), role = COALESCE(?, role) WHERE id = ?').run(
    name,
    email,
    role,
    id
  )

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id)
  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }
  res.json(formatUser(user))
})

// Admin: Delete user
app.delete('/api/admin/users/:id', authenticate, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' })
  }

  const { id } = req.params
  
  if (String(req.user.id) === id) {
    return res.status(400).json({ message: 'Cannot delete yourself' })
  }

  db.prepare('DELETE FROM users WHERE id = ?').run(id)
  res.json({ message: 'User deleted' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  console.log('Using SQLite database (fallback mode)')
})
