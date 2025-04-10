import request from 'supertest';
import app from '../../../app';

describe('Workspace API', () => {
  it('should create a workspace', async () => {
    const response = await request(app)
      .post('/api/v1/workspace')
      .send({ name: 'New Workspace' });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  it('should get a workspace by id', async () => {
    const response = await request(app)
      .get('/api/v1/workspace/1');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name');
  });

  it('should update a workspace', async () => {
    const response = await request(app)
      .put('/api/v1/workspace/1')
      .send({ name: 'Updated Workspace' });
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Updated Workspace');
  });

  it('should delete a workspace', async () => {
    const response = await request(app)
      .delete('/api/v1/workspace/1');
    expect(response.status).toBe(204);
  });
});