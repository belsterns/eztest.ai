import request from 'supertest';
import app from '../../../app';

describe('GET /api/v1/workspace/list', () => {
  it('should return a list of workspaces', async () => {
    const response = await request(app).get('/api/v1/workspace/list');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('workspaces');
  });

  it('should return 404 if no workspaces found', async () => {
    const response = await request(app).get('/api/v1/workspace/list?userId=nonexistent');
    expect(response.status).toBe(404);
  });
});