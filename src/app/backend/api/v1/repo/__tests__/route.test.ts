import request from 'supertest';
import app from '../../../app';

describe('Repo API Routes', () => {
  it('should get all repos', async () => {
    const response = await request(app).get('/api/v1/repo');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should create a new repo', async () => {
    const newRepo = { name: 'Test Repo', description: 'A test repository' };
    const response = await request(app).post('/api/v1/repo').send(newRepo);
    expect(response.status).toBe(201);
    expect(response.body.name).toBe(newRepo.name);
  });

  it('should return 404 for non-existent route', async () => {
    const response = await request(app).get('/api/v1/repo/non-existent');
    expect(response.status).toBe(404);
  });
});