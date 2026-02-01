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

async function setupDatabase() {
  console.log('Setting up database...')
  console.log('Supabase URL:', supabaseUrl)

  // First, let's try to create the users table using SQL
  const { error: tableError } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'student',
        avatar TEXT,
        bio TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `
  })

  if (tableError && !tableError.message.includes('already exists')) {
    console.log('Note: Could not create table via RPC (this is normal). Please create the table manually in Supabase dashboard.')
  }

  // Now try to create the admin user
  const adminEmail = 'admin@lms.com'
  const adminPassword = 'admin123'
  const adminName = 'Admin User'

  console.log('\nCreating admin user...')
  console.log('Email:', adminEmail)
  console.log('Password:', adminPassword)

  // Hash password
  const hashedPassword = bcrypt.hashSync(adminPassword, 10)

  // Try to insert admin user
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
      console.log('\n✅ Admin user already exists!')
      console.log('You can login with:')
      console.log('  Email: admin@lms.com')
      console.log('  Password: admin123')
    } else if (error.message.includes('relation "users" does not exist')) {
      console.log('\n❌ Users table does not exist!')
      console.log('\nPlease run this SQL in your Supabase SQL Editor:')
      console.log('```sql')
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

CREATE INDEX idx_users_email ON users(email);
      `)
      console.log('```')
      console.log('\nAfter creating the table, run this script again.')
    } else {
      console.error('\nError creating admin:', error.message)
      console.error('Details:', error)
    }
  } else {
    console.log('\n✅ Admin user created successfully!')
    console.log('  Email:', adminEmail)
    console.log('  Password:', adminPassword)
    console.log('  Role: admin')
    console.log('  ID:', data.id)
  }
}

setupDatabase().catch(console.error)
