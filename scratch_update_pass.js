import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

async function run() {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Shivam10@162006',
    database: 'octane_db',
  });

  try {
    const hashedPassword = await bcrypt.hash('password123', 10);
    await pool.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, 'admin@octane.com']);
    console.log('Password for admin@octane.com updated to: password123');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

run();
