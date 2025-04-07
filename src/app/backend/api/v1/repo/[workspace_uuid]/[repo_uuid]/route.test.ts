import request from 'supertest';
import app from '../../../app';

describe('Repo API', () => {
  const workspaceUuid = 'test-workspace-uuid';
  const repoUuid = 'test-repo-uuid';

  it('should get repo details', async () => {
    const response = await request(app).get(`/api/v1/repo/${workspaceUuid}/${repoUuid}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('uuid', repoUuid);
  });

  it('should return 404 for non-existent repo', async () => {
    const response = await request(app).get(`/api/v1/repo/${workspaceUuid}/non-existent-repo`);
    expect(response.status).toBe(404);
  });
});