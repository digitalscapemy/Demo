import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
config({ path: join(__dirname, '.env') })

console.log('Testing Supabase connection...')
console.log('URL:', process.env.SUPABASE_URL)
console.log('Key exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function testConnection() {
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('Connection failed:', error.message)
      
      if (error.message.includes('relation "users" does not exist')) {
        console.log('\n⚠️  The users table does not exist!')
        console.log('Please create it in Supabase dashboard with:')
        console.log(`
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'student',
  avatar TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
        `)
      }
    } else {
      console.log('✅ Connection successful!')
      console.log('Users count:', data)
    }
  } catch (err) {
    console.error('❌ Failed to connect:', err.message)
  }
}

testConnection()
