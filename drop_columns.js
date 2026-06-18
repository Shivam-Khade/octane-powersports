import mysql from 'mysql2/promise';

async function run() {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Shivam10@162006',
    database: 'octane_db',
  });

  try {
    console.log('Dropping bike_garage...');
    try { await pool.query(`ALTER TABLE users DROP COLUMN bike_garage`); } catch (e) { console.log('bike_garage not found or already dropped'); }
    console.log('Dropping fitment_preferences...');
    try { await pool.query(`ALTER TABLE users DROP COLUMN fitment_preferences`); } catch (e) { console.log('fitment_preferences not found or already dropped'); }
    console.log('Columns dropped successfully!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

run();
