import { UserSignUpRequestDto } from './UserSignUpRequestDto';

describe('UserSignUpRequestDto', () => {
  it('should create an instance with valid properties', () => {
    const dto = new UserSignUpRequestDto({
      username: 'testuser',
      password: 'password123',
      email: 'test@example.com'
    });
    expect(dto.username).toBe('testuser');
    expect(dto.password).toBe('password123');
    expect(dto.email).toBe('test@example.com');
  });

  it('should throw an error if required properties are missing', () => {
    expect(() => new UserSignUpRequestDto({
      username: '',
      password: '',
      email: ''
    })).toThrowError();
  });
});