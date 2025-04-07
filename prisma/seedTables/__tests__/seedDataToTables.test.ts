import { seedDataToTables } from '../seedDataToTables';

describe('seedDataToTables', () => {
  it('should seed data correctly', async () => {
    const result = await seedDataToTables();
    expect(result).toBeDefined();
    // Add more specific assertions based on the expected outcome
  });
});