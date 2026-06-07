import mysql from 'mysql2/promise';

async function run() {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Shivam10@162006',
    database: 'octane_db',
  });

  try {
    console.log('Altering blogs table...');
    await pool.query(`
      ALTER TABLE blogs 
      ADD COLUMN introText TEXT,
      ADD COLUMN quoteText TEXT,
      ADD COLUMN subHeading VARCHAR(255),
      ADD COLUMN bodyText TEXT;
    `);
    console.log('Successfully added columns.');
  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('Columns already exist.');
    } else {
      console.error('Error:', error);
    }
  } finally {
    await pool.end();
  }
}

run();
