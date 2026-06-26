import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function run() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'octane_db',
    ssl: process.env.DB_SSL === 'true' ? {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: true,
      servername: process.env.DB_SERVERNAME || undefined
    } : undefined
  });

  try {
    await pool.query('ALTER TABLE products ADD COLUMN sku VARCHAR(255) NULL;');
    console.log('Successfully added sku column.');
  } catch (e) {
    if (e.code === 'ER_DUP_FIELDNAME') {
      console.log('Column sku already exists.');
    } else {
      console.error(e);
    }
  } finally {
    pool.end();
  }
}

run();
