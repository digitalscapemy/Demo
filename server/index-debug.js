import express from 'express'
import cors from 'cors'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { config } from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
config({ path: join(__dirname, '.env') })

const app = express()
const PORT = 3001
const JWT_SECRET = process.env.JWT_SECRET || 'lms-secret-key-change-in-production'

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Key exists:', !!supabaseKey)

// Create users table if it doesn't exist
async function initializeDatabase() {
  // Create admin user if not exists
  const { data: existingAdmin } = await supabase
    .from('users')
    .select('id')
    .eq('email', 'admin@lms.com')
    .single()
  
  if (!existingAdmin) {
    const hashedPassword = bcrypt.hashSync('admin123', 10)
    const { error: insertError } = await supabase
      .from('users')
      .insert({
        name: 'Admin User',
        email: 'admin@lms.com',
        password: hashedPassword,
        role: 'admin'
      })
    
    if (!insertError) {
      console.log('Admin user created: admin@lms.com / admin123')
    }
  }
}

// Initialize database
initializeDatabase()

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}))
app.use(express.json())

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
  console.log('Headers:', req.headers)
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', req.body)
  }
  next()
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(500).json({ message: err.message || 'Internal server error' })
})

// Auth middleware
async function authenticate(req, res, next) {
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
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    bio: user.bio,
    createdAt: user.created_at
  }
}

// Routes

// Test route
app.get('/api/test', (req, res) => {
  console.log('Test route hit!')
  res.json({ message: 'Server is working!', timestamp: new Date().toISOString() })
})

// Register
app.post('/api/auth/register', async (req, res) => {
  console.log('Register endpoint called')
  try {
    const { name, email, password, role = 'student' } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' })
    }

    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()
    
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    const hashedPassword = bcrypt.hashSync(password, 10)
    const { data: user, error } = await supabase
      .from('users')
      .insert({
        name,
        email,
        password: hashedPassword,
        role: role === 'instructor' ? 'instructor' : 'student'
      })
      .select()
      .single()

    if (error) {
      console.error('Registration error:', error)
      return res.status(500).json({ message: 'Registration failed: ' + error.message })
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' })

    res.json({ user: formatUser(user), token })
  } catch (err) {
    console.error('Register exception:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Login
app.post('/api/auth/login', async (req, res) => {
  console.log('Login endpoint called')
  try {
    const { email, password } = req.body
    console.log('Login attempt for:', email)

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error) {
      console.error('Database error:', error)
      return res.status(500).json({ message: 'Database error: ' + error.message })
    }
    
    if (!user) {
      console.log('User not found')
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const validPassword = bcrypt.compareSync(password, user.password)
    if (!validPassword) {
      console.log('Invalid password')
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' })

    console.log('Login successful for:', email)
    res.json({ user: formatUser(user), token })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Get current user
app.get('/api/auth/me', authenticate, async (req, res) => {
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('id', req.user.id)
    .single()
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }
  res.json(formatUser(user))
})

// Update profile
app.put('/api/auth/profile', authenticate, async (req, res) => {
  const { name, bio, avatar } = req.body
  
  const { data: user } = await supabase
    .from('users')
    .update({
      name,
      bio,
      avatar
    })
    .eq('id', req.user.id)
    .select()
    .single()
  
  res.json(formatUser(user))
})

// Admin: Get all users
app.get('/api/admin/users', authenticate, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' })
  }

  const { data: users } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })
  
  res.json(users.map(formatUser))
})

// Admin: Create user
app.post('/api/admin/users', authenticate, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' })
  }

  const { name, email, password, role = 'student' } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' })
  }

  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single()
  
  if (existingUser) {
    return res.status(400).json({ message: 'Email already registered' })
  }

  const hashedPassword = bcrypt.hashSync(password, 10)
  const { data: user } = await supabase
    .from('users')
    .insert({
      name,
      email,
      password: hashedPassword,
      role
    })
    .select()
    .single()

  res.json(formatUser(user))
})

// Admin: Update user
app.put('/api/admin/users/:id', authenticate, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' })
  }

  const { name, email, role } = req.body
  const { id } = req.params

  const { data: user } = await supabase
    .from('users')
    .update({
      name,
      email,
      role
    })
    .eq('id', id)
    .select()
    .single()
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }
  res.json(formatUser(user))
})

// Admin: Delete user
app.delete('/api/admin/users/:id', authenticate, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' })
  }

  const { id } = req.params
  
  if (req.user.id === id) {
    return res.status(400).json({ message: 'Cannot delete yourself' })
  }

  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', id)
  
  if (error) {
    return res.status(500).json({ message: 'Failed to delete user' })
  }
  
  res.json({ message: 'User deleted' })
})

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`)
  console.log('📊 Debug mode enabled - all requests will be logged\n')
})
