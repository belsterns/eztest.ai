import request from 'supertest';
import app from '../../../app';

describe('Workspace API', () => {
  const workspaceUuid = 'test-uuid';

  it('should get workspace details', async () => {
    const response = await request(app)
      .get(`/api/v1/workspace/${workspaceUuid}`)
      .expect(200);

    expect(response.body).toHaveProperty('uuid', workspaceUuid);
  });

  it('should create a new workspace', async () => {
    const response = await request(app)
      .post('/api/v1/workspace')
      .send({ name: 'New Workspace' })
      .expect(201);

    expect(response.body).toHaveProperty('uuid');
    expect(response.body).toHaveProperty('name', 'New Workspace');
  });

  it('should update workspace details', async () => {
    const response = await request(app)
      .put(`/api/v1/workspace/${workspaceUuid}`)
      .send({ name: 'Updated Workspace' })
      .expect(200);

    expect(response.body).toHaveProperty('name', 'Updated Workspace');
  });

  it('should delete a workspace', async () => {
    await request(app)
      .delete(`/api/v1/workspace/${workspaceUuid}`)
      .expect(204);
  });
});