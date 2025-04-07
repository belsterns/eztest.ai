import { seedDatabase } from './seed';

describe('Database Seeding', () => {
  beforeAll(async () => {
    await seedDatabase();
  });

  it('should seed the database with initial data', async () => {
    // Add assertions to verify the data seeded in the database
  });
});