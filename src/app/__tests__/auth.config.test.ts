import { authConfig } from '../auth.config';

describe('Auth Config', () => {
  it('should have the correct properties', () => {
    expect(authConfig).toHaveProperty('jwtSecret');
    expect(authConfig).toHaveProperty('expiresIn');
  });

  it('should have valid jwtSecret', () => {
    expect(authConfig.jwtSecret).toBeDefined();
    expect(authConfig.jwtSecret).toBeString();
  });

  it('should have valid expiresIn', () => {
    expect(authConfig.expiresIn).toBeDefined();
    expect(authConfig.expiresIn).toMatch(/\d+[smhd]/);
  });
});