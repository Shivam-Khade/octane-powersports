const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

(async () => {
  try {
    const con = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'Shivam10@162006',
      database: 'octane_db'
    });
    
    const hash = await bcrypt.hash('admin123', 10);
    console.log('NEW HASH:', hash);

    const [result] = await con.query(
      'UPDATE users SET password = ? WHERE email = ?',
      [hash, 'admin@octane.com']
    );

    console.log('UPDATE RESULT:', result.affectedRows);
    con.end();
  } catch (e) {
    console.log('ERROR:', e.message);
  }
})();
