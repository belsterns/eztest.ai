import { CustomError } from './exceptions';

describe('CustomError', () => {
  it('should create an instance of CustomError with a message', () => {
    const error = new CustomError('Test error');
    expect(error.message).toBe('Test error');
    expect(error.name).toBe('CustomError');
  });

  it('should create an instance of CustomError with a message and status code', () => {
    const error = new CustomError('Test error', 404);
    expect(error.message).toBe('Test error');
    expect(error.statusCode).toBe(404);
  });
});