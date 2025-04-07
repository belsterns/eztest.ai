import { AuthValidator } from '../AuthValidator';

describe('AuthValidator', () => {
  it('should validate user credentials correctly', () => {
    const validCredentials = { username: 'user', password: 'pass' };
    const result = AuthValidator.validate(validCredentials);
    expect(result).toBe(true);
  });

  it('should invalidate incorrect user credentials', () => {
    const invalidCredentials = { username: '', password: '' };
    const result = AuthValidator.validate(invalidCredentials);
    expect(result).toBe(false);
  });
});