import { CustomException } from './exceptions';

describe('CustomException', () => {
  it('should create an instance of CustomException', () => {
    const exception = new CustomException('Test message');
    expect(exception.message).toBe('Test message');
    expect(exception.name).toBe('CustomException');
  });
});