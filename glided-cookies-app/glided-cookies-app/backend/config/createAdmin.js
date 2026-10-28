// Script to create admin user with proper bcrypt hash
// Run: node config/createAdmin.js
import bcrypt from 'bcryptjs';
import pool from './db.js';

const email = 'admin@cremencrumbs.com';
const plainPassword = 'admin@123';

async function createAdmin() {
  try {
    const hash = await bcrypt.hash(plainPassword, 10);
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      await pool.query('UPDATE users SET password_hash = ?, role = ? WHERE email = ?', [hash, 'admin', email]);
      console.log('✅ Admin user updated with correct password hash.');
    } else {
      await pool.query(
        'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
        ['Admin', email, hash, 'admin']
      );
      console.log('✅ Admin user created.');
    }
    console.log(`   Email:    ${email}`);
    console.log(`   Password: ${plainPassword}`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

createAdmin();
