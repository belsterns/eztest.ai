import request from 'supertest';
import app from '../../../app';

describe('Workspace Repo API', () => {
  const workspaceUuid = 'test-uuid';

  it('should create a new repo', async () => {
    const response = await request(app)
      .post(`/api/v1/workspace/${workspaceUuid}/repo`)
      .send({ name: 'new-repo' });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  it('should get a repo by id', async () => {
    const response = await request(app)
      .get(`/api/v1/workspace/${workspaceUuid}/repo/test-repo-id`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name', 'test-repo-id');
  });

  it('should update a repo', async () => {
    const response = await request(app)
      .put(`/api/v1/workspace/${workspaceUuid}/repo/test-repo-id`)
      .send({ name: 'updated-repo' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name', 'updated-repo');
  });

  it('should delete a repo', async () => {
    const response = await request(app)
      .delete(`/api/v1/workspace/${workspaceUuid}/repo/test-repo-id`);

    expect(response.status).toBe(204);
  });
});