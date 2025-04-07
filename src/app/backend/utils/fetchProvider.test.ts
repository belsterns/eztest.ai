import { fetchProvider } from './fetchProvider';

describe('fetchProvider', () => {
  it('should return data when called with valid URL', async () => {
    const data = await fetchProvider('https://api.example.com/data');
    expect(data).toBeDefined();
  });

  it('should throw an error when called with invalid URL', async () => {
    await expect(fetchProvider('invalid-url')).rejects.toThrow();
  });

  it('should handle network errors gracefully', async () => {
    await expect(fetchProvider('https://api.example.com/404')).rejects.toThrow();
  });
});