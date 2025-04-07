import request from 'supertest';
import app from '../../../../app';

describe('POST /api/v1/agent/create-branch', () => {
  it('should create a new branch successfully', async () => {
    const response = await request(app)
      .post('/api/v1/agent/create-branch')
      .send({ name: 'New Branch', agentId: '12345' });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  it('should return 400 for missing fields', async () => {
    const response = await request(app)
      .post('/api/v1/agent/create-branch')
      .send({});
    expect(response.status).toBe(400);
  });

  it('should return 404 for invalid agentId', async () => {
    const response = await request(app)
      .post('/api/v1/agent/create-branch')
      .send({ name: 'New Branch', agentId: 'invalidId' });
    expect(response.status).toBe(404);
  });
});