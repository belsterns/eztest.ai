import { handler } from './route';
import { Request, Response } from 'express';

describe('Role List API', () => {
  it('should return a list of roles', async () => {
    const req = {} as Request;
    const res = { json: jest.fn() } as unknown as Response;

    await handler(req, res);

    expect(res.json).toHaveBeenCalledWith(expect.any(Array));
  });
});