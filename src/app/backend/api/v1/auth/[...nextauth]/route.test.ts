import { NextAuthOptions } from 'next-auth';
import { authHandler } from './route';

describe('Auth Route', () => {
  it('should return a valid session on successful login', async () => {
    const req = { method: 'POST', body: { email: 'test@example.com', password: 'password' } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    await authHandler(req, res);

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ session: expect.any(Object) }));
  });

  it('should return an error on failed login', async () => {
    const req = { method: 'POST', body: { email: 'wrong@example.com', password: 'wrongpassword' } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    await authHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
  });
});