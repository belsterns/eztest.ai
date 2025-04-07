import { fetchModifiedFiles } from './route';

describe('fetchModifiedFiles', () => {
  it('should return modified files', async () => {
    const result = await fetchModifiedFiles();
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  it('should handle errors gracefully', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(() => Promise.reject('API is down'));
    await expect(fetchModifiedFiles()).rejects.toThrow('API is down');
  });
});