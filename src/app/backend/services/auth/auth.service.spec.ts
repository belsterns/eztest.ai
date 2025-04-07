import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    service = new AuthService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login successfully', async () => {
    const result = await service.login('username', 'password');
    expect(result).toHaveProperty('token');
  });

  it('should throw error on login failure', async () => {
    await expect(service.login('wrongUser', 'wrongPass')).rejects.toThrow('Login failed');
  });

  it('should logout successfully', () => {
    service.logout();
    expect(service.isLoggedIn).toBe(false);
  });
});