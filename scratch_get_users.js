import mysql from 'mysql2/promise';

async function run() {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Shivam10@162006',
    database: 'octane_db',
  });

  try {
    const [rows] = await pool.query('SELECT email, password, role FROM users LIMIT 5');
    console.log(JSON.stringify(rows, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

run();
