import { PasswordValidator } from './PasswordValidator';

describe('PasswordValidator', () => {
  it('should validate a strong password', () => {
    const result = PasswordValidator.validate('StrongP@ssw0rd');
    expect(result).toBe(true);
  });

  it('should invalidate a weak password', () => {
    const result = PasswordValidator.validate('weak');
    expect(result).toBe(false);
  });

  it('should invalidate a password without numbers', () => {
    const result = PasswordValidator.validate('NoNumbers!');
    expect(result).toBe(false);
  });

  it('should invalidate a password without special characters', () => {
    const result = PasswordValidator.validate('NoSpecial123');
    expect(result).toBe(false);
  });

  it('should invalidate a password shorter than 8 characters', () => {
    const result = PasswordValidator.validate('Short1!');
    expect(result).toBe(false);
  });
});