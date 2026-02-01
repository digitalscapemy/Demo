import express from 'express'
import cors from 'cors'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

config({ path: join(__dirname, '.env') })

const app = express()
const PORT = 3001
const JWT_SECRET = process.env.JWT_SECRET || 'lms-secret-key-change-in-production'

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

console.log('Server starting...')
console.log('Supabase URL:', process.env.SUPABASE_URL)

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!' })
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body
    console.log('Login attempt:', email)

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error || !user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const validPassword = bcrypt.compareSync(password, user.password)
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' })

    res.json({ 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        createdAt: user.created_at
      }, 
      token 
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
