import request from 'supertest';
import app from '../../../../app';

describe('GET /api/v1/agent/get-all-branches', () => {
  it('should return all branches', async () => {
    const response = await request(app).get('/api/v1/agent/get-all-branches');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('branches');
    expect(Array.isArray(response.body.branches)).toBe(true);
  });

  it('should handle errors gracefully', async () => {
    const response = await request(app).get('/api/v1/agent/get-all-branches?error=true');
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error');
  });
});