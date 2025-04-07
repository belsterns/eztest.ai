import request from 'supertest';
import app from '../app';

describe('Repo API', () => {
  it('should return a list of repositories', async () => {
    const response = await request(app).get('/api/v1/repo');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should return a repository by ID', async () => {
    const response = await request(app).get('/api/v1/repo/1');
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(1);
  });

  it('should return 404 for non-existent repository', async () => {
    const response = await request(app).get('/api/v1/repo/999');
    expect(response.status).toBe(404);
  });
});