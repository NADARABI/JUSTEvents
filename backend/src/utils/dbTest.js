// src/utils/dbTest.js
import db from './db.js';

async function testConnection() {
  try {
    const [rows] = await db.execute(
      'SELECT "Connection successful" AS status'
    );
    console.log(rows[0].status);
  } catch (error) {
    console.error('Connection failed:', error.message);
  }
}

testConnection();
