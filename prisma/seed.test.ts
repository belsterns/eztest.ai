import { seedDatabase } from './seed';

describe('Database Seeding', () => {
  it('should seed the database with initial data', async () => {
    await seedDatabase();
    // Add assertions to verify that the database has been seeded correctly
  });
});