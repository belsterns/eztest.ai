import { errorHandler } from '../errorHandler';

describe('errorHandler', () => {
  it('should return a 400 status for validation errors', () => {
    const error = { status: 400, message: 'Validation Error' };
    const response = errorHandler(error);
    expect(response.status).toBe(400);
    expect(response.message).toBe('Validation Error');
  });

  it('should return a 500 status for generic errors', () => {
    const error = new Error('Something went wrong');
    const response = errorHandler(error);
    expect(response.status).toBe(500);
    expect(response.message).toBe('Internal Server Error');
  });

  it('should handle unknown errors gracefully', () => {
    const error = { unknown: true };
    const response = errorHandler(error);
    expect(response.status).toBe(500);
    expect(response.message).toBe('Internal Server Error');
  });
});