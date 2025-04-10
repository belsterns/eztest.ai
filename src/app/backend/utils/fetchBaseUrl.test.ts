import { fetchBaseUrl } from './fetchBaseUrl';

describe('fetchBaseUrl', () => {
  it('should return the correct base URL for production', () => {
    process.env.NODE_ENV = 'production';
    expect(fetchBaseUrl()).toBe('https://api.production.com');
  });

  it('should return the correct base URL for development', () => {
    process.env.NODE_ENV = 'development';
    expect(fetchBaseUrl()).toBe('http://localhost:3000');
  });

  it('should return the correct base URL for test', () => {
    process.env.NODE_ENV = 'test';
    expect(fetchBaseUrl()).toBe('http://localhost:3000');
  });
});