import { authenticateUser, registerUser } from './user.auth';

describe('User Authentication', () => {
  test('should authenticate user with valid credentials', () => {
    const user = { username: 'testUser', password: 'testPass' };
    const result = authenticateUser(user);
    expect(result).toBeTruthy();
  });

  test('should not authenticate user with invalid credentials', () => {
    const user = { username: 'testUser', password: 'wrongPass' };
    const result = authenticateUser(user);
    expect(result).toBeFalsy();
  });

  test('should register a new user', () => {
    const newUser = { username: 'newUser', password: 'newPass' };
    const result = registerUser(newUser);
    expect(result).toEqual({ success: true, message: 'User registered successfully' });
  });

  test('should not register a user with existing username', () => {
    const existingUser = { username: 'testUser', password: 'testPass' };
    const result = registerUser(existingUser);
    expect(result).toEqual({ success: false, message: 'Username already exists' });
  });
});