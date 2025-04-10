import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Prisma Client', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('should create a record', async () => {
    const user = await prisma.user.create({
      data: { name: 'Test User', email: 'test@example.com' }
    });
    expect(user).toHaveProperty('id');
    expect(user.name).toBe('Test User');
  });

  test('should retrieve a record', async () => {
    const user = await prisma.user.findFirst({
      where: { email: 'test@example.com' }
    });
    expect(user).toHaveProperty('id');
    expect(user.name).toBe('Test User');
  });
});