import { PasswordValidator } from './PasswordValidator';

describe('PasswordValidator', () => {
  it('should validate a password with at least 8 characters', () => {
    const result = PasswordValidator.validate('password123');
    expect(result).toBe(true);
  });

  it('should invalidate a password with less than 8 characters', () => {
    const result = PasswordValidator.validate('short');
    expect(result).toBe(false);
  });

  it('should invalidate a password without numbers', () => {
    const result = PasswordValidator.validate('password');
    expect(result).toBe(false);
  });

  it('should validate a password with letters and numbers', () => {
    const result = PasswordValidator.validate('pass1234');
    expect(result).toBe(true);
  });
});