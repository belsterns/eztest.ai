import { handler } from './route';

describe('Route Handler', () => {
  it('should return 200 for valid requests', async () => {
    const req = { /* mock request object */ };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.any(Object));
  });

  it('should return 404 for invalid requests', async () => {
    const req = { /* mock invalid request object */ };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Not Found' });
  });
});