// src/utils/dbTest.js
import db from './db.js';

async function testDBConnection() {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS result');
    console.log('Database connection is working:', rows[0].result);
  } catch (error) {
    console.error('Error testing database connection:', error.message);
  }
}

testDBConnection();
