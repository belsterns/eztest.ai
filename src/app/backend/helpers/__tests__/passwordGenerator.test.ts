import { generatePassword } from '../passwordGenerator';

describe('Password Generator', () => {
  it('should generate a password of specified length', () => {
    const length = 12;
    const password = generatePassword(length);
    expect(password.length).toBe(length);
  });

  it('should include at least one uppercase letter', () => {
    const password = generatePassword(12);
    expect(/[A-Z]/.test(password)).toBe(true);
  });

  it('should include at least one lowercase letter', () => {
    const password = generatePassword(12);
    expect(/[a-z]/.test(password)).toBe(true);
  });

  it('should include at least one number', () => {
    const password = generatePassword(12);
    expect(/[0-9]/.test(password)).toBe(true);
  });

  it('should include at least one special character', () => {
    const password = generatePassword(12);
    expect(/[^A-Za-z0-9]/.test(password)).toBe(true);
  });
});