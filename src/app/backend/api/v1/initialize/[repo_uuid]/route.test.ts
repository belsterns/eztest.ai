import { handler } from './route';

describe('Handler Tests', () => {
  it('should initialize with valid repo_uuid', async () => {
    const req = { params: { repo_uuid: 'valid-uuid' } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    await handler(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });

  it('should return 404 for invalid repo_uuid', async () => {
    const req = { params: { repo_uuid: 'invalid-uuid' } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Not Found' }));
  });
});