import request from 'supertest';
import app from '../app';

describe('Swagger JSON Route', () => {
  it('should return swagger JSON', async () => {
    const response = await request(app).get('/api/v1/docs/swagger-json');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('application/json');
  });
});