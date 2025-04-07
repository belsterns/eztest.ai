import { authenticateUser, registerUser } from './user.auth';

describe('User Authentication', () => {
  test('should authenticate user with valid credentials', () => {
    const credentials = { username: 'testUser', password: 'testPass' };
    const result = authenticateUser(credentials);
    expect(result).toBeTruthy();
  });

  test('should not authenticate user with invalid credentials', () => {
    const credentials = { username: 'wrongUser', password: 'wrongPass' };
    const result = authenticateUser(credentials);
    expect(result).toBeFalsy();
  });

  test('should register a new user', () => {
    const newUser = { username: 'newUser', password: 'newPass' };
    const result = registerUser(newUser);
    expect(result).toEqual(expect.objectContaining({ username: 'newUser' }));
  });
});