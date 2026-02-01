import bcrypt from 'bcryptjs'

const password = 'admin123'
const hashedPassword = bcrypt.hashSync(password, 10)

console.log('Password:', password)
console.log('Hashed Password:', hashedPassword)
console.log('\nUse this SQL to insert admin user:')
console.log(`INSERT INTO users (name, email, password, role) VALUES ('Admin User', 'admin@lms.com', '${hashedPassword}', 'admin');`)
