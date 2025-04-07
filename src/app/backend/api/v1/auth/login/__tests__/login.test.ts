import request from 'supertest';
import app from '../../../app';

describe('POST /api/v1/auth/login', () => {
  it('should return 200 and a token for valid credentials', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ username: 'validUser', password: 'validPassword' });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should return 401 for invalid credentials', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ username: 'invalidUser', password: 'invalidPassword' });
    expect(response.status).toBe(401);
  });
});