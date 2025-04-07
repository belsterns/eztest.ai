import request from 'supertest';
import app from '../../../app';

describe('GET /api/v1/agent/get-all-files-in-a-folder-from-a-branch', () => {
  it('should return a list of files in a folder from a branch', async () => {
    const response = await request(app)
      .get('/api/v1/agent/get-all-files-in-a-folder-from-a-branch?branch=main&folder=src')
      .expect(200);

    expect(response.body).toBeDefined();
    expect(Array.isArray(response.body.files)).toBe(true);
  });

  it('should return 404 if the branch does not exist', async () => {
    const response = await request(app)
      .get('/api/v1/agent/get-all-files-in-a-folder-from-a-branch?branch=nonexistent&folder=src')
      .expect(404);

    expect(response.body.message).toBe('Branch not found');
  });

  it('should return 400 if folder parameter is missing', async () => {
    const response = await request(app)
      .get('/api/v1/agent/get-all-files-in-a-folder-from-a-branch?branch=main')
      .expect(400);

    expect(response.body.message).toBe('Folder parameter is required');
  });
});