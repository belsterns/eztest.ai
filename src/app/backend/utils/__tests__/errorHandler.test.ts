import { errorHandler } from '../errorHandler';
import { Request, Response, NextFunction } from 'express';

describe('errorHandler', () => {
  it('should handle errors correctly', () => {
    const req = {} as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
    const next = jest.fn() as NextFunction;

    const error = new Error('Test error');
    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Test error' });
  });

  it('should call next if error is not an instance of Error', () => {
    const req = {} as Request;
    const res = {} as Response;
    const next = jest.fn() as NextFunction;

    errorHandler('Not an error', req, res, next);

    expect(next).toHaveBeenCalledWith('Not an error');
  });
});