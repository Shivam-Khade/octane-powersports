import mysql from 'mysql2/promise';

declare global {
  var _mysqlPool: mysql.Pool | undefined;
}

const pool = global._mysqlPool || mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'octane_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: process.env.DB_SSL === 'true' ? {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true,
    servername: process.env.DB_SERVERNAME || undefined
  } as any : undefined
});

if (process.env.NODE_ENV !== 'production') {
  global._mysqlPool = pool;
}

export default pool;
