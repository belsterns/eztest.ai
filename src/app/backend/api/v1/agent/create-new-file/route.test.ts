import request from 'supertest';
import app from '../../../../app';

describe('POST /api/v1/agent/create-new-file', () => {
  it('should create a new file and return success', async () => {
    const response = await request(app)
      .post('/api/v1/agent/create-new-file')
      .send({ filename: 'testfile.txt', content: 'Hello World' });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'File created successfully');
  });

  it('should return an error if filename is missing', async () => {
    const response = await request(app)
      .post('/api/v1/agent/create-new-file')
      .send({ content: 'Hello World' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Filename is required');
  });
});