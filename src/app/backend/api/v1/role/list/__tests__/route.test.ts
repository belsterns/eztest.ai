import { listRoles } from '../route';

describe('listRoles', () => {
  it('should return a list of roles', async () => {
    const result = await listRoles();
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  it('should handle errors gracefully', async () => {
    // Mock an error scenario
    jest.spyOn(global, 'fetch').mockImplementation(() => Promise.reject('API is down'));
    await expect(listRoles()).rejects.toThrow('API is down');
  });
});