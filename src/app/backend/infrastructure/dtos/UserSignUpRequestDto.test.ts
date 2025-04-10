import { UserSignUpRequestDto } from './UserSignUpRequestDto';

describe('UserSignUpRequestDto', () => {
  it('should create an instance with valid properties', () => {
    const dto = new UserSignUpRequestDto('test@example.com', 'password123');
    expect(dto.email).toBe('test@example.com');
    expect(dto.password).toBe('password123');
  });

  it('should throw an error if email is invalid', () => {
    expect(() => new UserSignUpRequestDto('invalid-email', 'password123')).toThrowError('Invalid email format');
  });

  it('should throw an error if password is too short', () => {
    expect(() => new UserSignUpRequestDto('test@example.com', 'short')).toThrowError('Password must be at least 6 characters long');
  });
});