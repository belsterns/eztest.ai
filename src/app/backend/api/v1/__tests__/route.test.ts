import request from 'supertest';
import app from '../app';

describe('API V1 Routes', () => {
  it('should respond with a 200 status for GET /api/v1/resource', async () => {
    const response = await request(app).get('/api/v1/resource');
    expect(response.status).toBe(200);
  });

  it('should respond with a 404 status for non-existing routes', async () => {
    const response = await request(app).get('/api/v1/non-existing');
    expect(response.status).toBe(404);
  });
});