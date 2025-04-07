import request from 'supertest';
import app from '../../../app';

describe('PUT /api/v1/agent/update-existing-file', () => {
  it('should update an existing file successfully', async () => {
    const response = await request(app)
      .put('/api/v1/agent/update-existing-file')
      .send({ fileId: '123', newData: 'Updated content' });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'File updated successfully');
  });

  it('should return 404 if file does not exist', async () => {
    const response = await request(app)
      .put('/api/v1/agent/update-existing-file')
      .send({ fileId: 'nonexistent', newData: 'Updated content' });
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'File not found');
  });

  it('should return 400 for invalid input', async () => {
    const response = await request(app)
      .put('/api/v1/agent/update-existing-file')
      .send({ fileId: '', newData: '' });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Invalid input');
  });
});