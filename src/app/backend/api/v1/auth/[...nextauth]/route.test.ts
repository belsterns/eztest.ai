import { handler } from './route';

describe('Auth Route', () => {
  it('should return a 200 status on successful authentication', async () => {
    const req = { method: 'POST', body: { username: 'test', password: 'test' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.any(Object));
  });

  it('should return a 401 status on failed authentication', async () => {
    const req = { method: 'POST', body: { username: 'wrong', password: 'wrong' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
  });
});