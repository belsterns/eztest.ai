import request from 'supertest';
import app from '../app';

describe('Webhook API', () => {
  it('should respond with 200 on valid webhook', async () => {
    const response = await request(app)
      .post('/api/v1/webhook')
      .send({ valid: 'data' });
    expect(response.status).toBe(200);
  });

  it('should respond with 400 on invalid webhook', async () => {
    const response = await request(app)
      .post('/api/v1/webhook')
      .send({ invalid: 'data' });
    expect(response.status).toBe(400);
  });
});