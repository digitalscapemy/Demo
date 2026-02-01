import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
config({ path: join(__dirname, '.env') })

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

async function createAdmin() {
  const adminEmail = 'admin@lms.com'
  const adminPassword = 'admin123'
  const adminName = 'Admin User'

  console.log('Creating admin user...')
  console.log('Email:', adminEmail)
  console.log('Password:', adminPassword)

  // Hash password
  const hashedPassword = bcrypt.hashSync(adminPassword, 10)

  // Insert admin user
  const { data, error } = await supabase
    .from('users')
    .insert({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: 'admin'
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      console.log('\nAdmin user already exists!')
      console.log('You can login with:')
      console.log('  Email: admin@lms.com')
      console.log('  Password: admin123')
    } else {
      console.error('\nError creating admin:', error.message)
    }
  } else {
    console.log('\n✅ Admin user created successfully!')
    console.log('  Email:', adminEmail)
    console.log('  Password:', adminPassword)
    console.log('  Role: admin')
    console.log('  ID:', data.id)
  }
}

createAdmin()
