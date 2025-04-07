import request from 'supertest';
import app from '../app';

describe('API V1 Routes', () => {
  it('should return 200 on GET /api/v1/example', async () => {
    const response = await request(app).get('/api/v1/example');
    expect(response.status).toBe(200);
  });

  it('should return 404 on non-existent route', async () => {
    const response = await request(app).get('/api/v1/non-existent');
    expect(response.status).toBe(404);
  });
});