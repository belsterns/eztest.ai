import { authenticate, register } from './auth';

describe('Authentication Module', () => {
  test('should register a new user', async () => {
    const user = { username: 'testuser', password: 'password123' };
    const response = await register(user);
    expect(response).toHaveProperty('id');
    expect(response.username).toBe(user.username);
  });

  test('should authenticate an existing user', async () => {
    const user = { username: 'testuser', password: 'password123' };
    const response = await authenticate(user);
    expect(response).toHaveProperty('token');
  });

  test('should fail to authenticate with wrong password', async () => {
    const user = { username: 'testuser', password: 'wrongpassword' };
    await expect(authenticate(user)).rejects.toThrow('Invalid credentials');
  });
});