import request from 'supertest';
import app from '../../../app';

describe('Workspace API', () => {
  const workspaceUuid = 'test-uuid';

  it('should return workspace details', async () => {
    const response = await request(app).get(`/api/v1/workspace/${workspaceUuid}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('uuid', workspaceUuid);
  });

  it('should create a new workspace', async () => {
    const response = await request(app).post(`/api/v1/workspace`).send({ name: 'New Workspace' });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('uuid');
  });

  it('should update an existing workspace', async () => {
    const response = await request(app).put(`/api/v1/workspace/${workspaceUuid}`).send({ name: 'Updated Workspace' });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name', 'Updated Workspace');
  });

  it('should delete a workspace', async () => {
    const response = await request(app).delete(`/api/v1/workspace/${workspaceUuid}`);
    expect(response.status).toBe(204);
  });
});