import { login, logout } from '../auth';

describe('Auth Module', () => {
  test('login function should return user data', async () => {
    const userData = await login('testUser', 'testPassword');
    expect(userData).toHaveProperty('id');
    expect(userData).toHaveProperty('username', 'testUser');
  });

  test('logout function should clear user session', () => {
    logout();
    expect(sessionStorage.getItem('user')).toBeNull();
  });
});