import request from 'supertest';
import app from '../../../app';

describe('Swagger Route', () => {
  it('should return 200 and swagger JSON', async () => {
    const response = await request(app).get('/api/v1/docs/swagger.json');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('swagger');
  });

  it('should return 200 for the swagger UI', async () => {
    const response = await request(app).get('/api/v1/docs/swagger');
    expect(response.status).toBe(200);
    expect(response.text).toContain('Swagger UI');
  });
});