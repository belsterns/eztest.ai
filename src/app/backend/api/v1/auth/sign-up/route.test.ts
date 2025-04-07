import request from 'supertest';
import app from '../../../app';

describe('Sign Up API', () => {
  it('should create a new user successfully', async () => {
    const response = await request(app)
      .post('/api/v1/auth/sign-up')
      .send({ username: 'testuser', password: 'testpass' });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'User created successfully');
  });

  it('should return validation error for missing fields', async () => {
    const response = await request(app)
      .post('/api/v1/auth/sign-up')
      .send({ username: '' });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Username and password are required');
  });

  it('should return error for existing username', async () => {
    await request(app)
      .post('/api/v1/auth/sign-up')
      .send({ username: 'testuser', password: 'testpass' });
    const response = await request(app)
      .post('/api/v1/auth/sign-up')
      .send({ username: 'testuser', password: 'newpass' });
    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty('error', 'Username already exists');
  });
});