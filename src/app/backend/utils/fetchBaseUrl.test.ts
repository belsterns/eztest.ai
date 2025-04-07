import { fetchBaseUrl } from './fetchBaseUrl';

describe('fetchBaseUrl', () => {
  it('should return the correct base URL', () => {
    const expectedUrl = 'http://localhost:3000'; // replace with actual expected URL
    const result = fetchBaseUrl();
    expect(result).toBe(expectedUrl);
  });

  it('should handle environment variables correctly', () => {
    process.env.BASE_URL = 'http://test-url.com';
    const result = fetchBaseUrl();
    expect(result).toBe('http://test-url.com');
    delete process.env.BASE_URL;
  });

  it('should return a default URL if no environment variable is set', () => {
    delete process.env.BASE_URL;
    const result = fetchBaseUrl();
    expect(result).toBe('http://localhost:3000'); // replace with actual default URL
  });
});