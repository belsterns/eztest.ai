import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    service = new AuthService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should authenticate user', () => {
    const result = service.authenticate('username', 'password');
    expect(result).toBe(true);
  });

  it('should return false for invalid credentials', () => {
    const result = service.authenticate('invalidUser', 'invalidPass');
    expect(result).toBe(false);
  });
});