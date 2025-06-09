import db from '../utils/db.js';
import mysql from 'mysql2/promise';

jest.mock('mysql2/promise', () => {
  const mPool = {
    execute: jest.fn(),
    query: jest.fn(),
    getConnection: jest.fn().mockResolvedValue({ release: jest.fn() }),
  };
  return {
    createPool: jest.fn(() => mPool),
  };
});

describe('db.js', () => {
  it('should create a mysql pool with correct static config', () => {
    const mysql = require('mysql2/promise');
    const callArgs = mysql.createPool.mock.calls[0][0];
    expect(callArgs.waitForConnections).toBe(true);
    expect(callArgs.connectionLimit).toBe(10);
    expect(callArgs.queueLimit).toBe(0);
  });

  it('should have execute, query, and getConnection methods', () => {
    expect(typeof db.execute).toBe('function');
    expect(typeof db.query).toBe('function');
    expect(typeof db.getConnection).toBe('function');
  });

  it('getConnection should resolve to a connection object', async () => {
    const conn = await db.getConnection();
    expect(conn).toHaveProperty('release');
    expect(typeof conn.release).toBe('function');
  });
}); 