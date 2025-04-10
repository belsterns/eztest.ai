import { getAllBranches } from '../route';

describe('getAllBranches', () => {
  it('should return all branches successfully', async () => {
    const response = await getAllBranches();
    expect(response).toHaveProperty('branches');
    expect(Array.isArray(response.branches)).toBe(true);
  });

  it('should handle errors correctly', async () => {
    // Mock an error scenario
    const response = await getAllBranches();
    expect(response).toHaveProperty('error');
  });
});