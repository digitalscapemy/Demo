import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

config({ path: join(__dirname, '.env') })

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function testLogin() {
  console.log('Testing login query...')
  
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'admin@lms.com')
      .single()
    
    if (error) {
      console.error('Query error:', error)
    } else {
      console.log('User found:', data)
    }
  } catch (err) {
    console.error('Connection error:', err)
  }
}

testLogin()
