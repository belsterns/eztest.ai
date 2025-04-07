import request from 'supertest';
import app from '../../../app';

describe('Workspace Repo API', () => {
  const workspaceUuid = 'test-uuid';

  it('should get repo details', async () => {
    const response = await request(app)
      .get(`/api/v1/workspace/${workspaceUuid}/repo`)
      .expect(200);

    expect(response.body).toHaveProperty('repo');
  });

  it('should create a new repo', async () => {
    const response = await request(app)
      .post(`/api/v1/workspace/${workspaceUuid}/repo`)
      .send({ name: 'new-repo' })
      .expect(201);

    expect(response.body).toHaveProperty('repo.id');
  });

  it('should return 404 for non-existing repo', async () => {
    const response = await request(app)
      .get(`/api/v1/workspace/${workspaceUuid}/repo/non-existing`)
      .expect(404);

    expect(response.body).toHaveProperty('error');
  });
});