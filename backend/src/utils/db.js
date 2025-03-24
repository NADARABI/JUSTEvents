// src/utils/db.js
import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config(); // Load .env file

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Export promise-based pool
export default pool.promise();
