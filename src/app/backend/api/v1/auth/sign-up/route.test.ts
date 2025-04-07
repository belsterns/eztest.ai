import request from 'supertest';
import app from '../../../../app';

describe('POST /api/v1/auth/sign-up', () => {
  it('should create a new user and return 201', async () => {
    const response = await request(app)
      .post('/api/v1/auth/sign-up')
      .send({ username: 'testuser', password: 'testpass' });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('userId');
  });

  it('should return 400 if username is missing', async () => {
    const response = await request(app)
      .post('/api/v1/auth/sign-up')
      .send({ password: 'testpass' });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should return 400 if password is missing', async () => {
    const response = await request(app)
      .post('/api/v1/auth/sign-up')
      .send({ username: 'testuser' });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
});