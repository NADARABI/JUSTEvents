import request from 'supertest';
import app from '../../app.js';
import db from '../../utils/db.js';

describe('Admin Controller', () => {
  beforeAll(async () => {
    // Clean up before tests
    await db.execute('DELETE FROM users WHERE email = ?', ['testuser@example.com']);
  });

  afterAll(async () => {
    await db.end();
  });

  test('GET /admin/pending-users → should return pending users', async () => {
    const response = await request(app)
      .get('/admin/pending-users')
      .set('Authorization', `Bearer ${process.env.ADMIN_TOKEN}`);
    
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Pending users fetched successfully');
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  test('PATCH /admin/approve/:id → should approve a user', async () => {
    const response = await request(app)
      .patch('/admin/approve/2')
      .set('Authorization', `Bearer ${process.env.ADMIN_TOKEN}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toContain('User approved as');
  });

  test('PATCH /admin/reject/:id → should reject a user', async () => {
    const response = await request(app)
      .patch('/admin/reject/2')
      .set('Authorization', `Bearer ${process.env.ADMIN_TOKEN}`);
      
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('User rejected and set as Visitor');
  });
});
