import request from 'supertest';
import app from '../../../app';

describe('Swagger Route', () => {
  it('should return the swagger documentation', async () => {
    const response = await request(app).get('/api/v1/docs/swagger');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('swagger');
  });
});