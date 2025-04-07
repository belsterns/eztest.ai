import { fetchProvider } from './fetchProvider';

describe('fetchProvider', () => {
  it('should fetch data successfully', async () => {
    const data = await fetchProvider('https://api.example.com/data');
    expect(data).toBeDefined();
  });

  it('should handle errors', async () => {
    await expect(fetchProvider('https://api.example.com/error')).rejects.toThrow();
  });
});