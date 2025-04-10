import { AuthValidator } from '../AuthValidator';

describe('AuthValidator', () => {
  it('should validate correct credentials', () => {
    const result = AuthValidator.validate('validUser', 'validPassword');
    expect(result).toBe(true);
  });

  it('should invalidate incorrect credentials', () => {
    const result = AuthValidator.validate('invalidUser', 'invalidPassword');
    expect(result).toBe(false);
  });

  it('should require username and password', () => {
    const result = AuthValidator.validate('', '');
    expect(result).toBe(false);
  });
});