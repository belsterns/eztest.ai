import { GiteaStrategy } from './GiteaStrategy';

describe('GiteaStrategy', () => {
  let strategy: GiteaStrategy;

  beforeEach(() => {
    strategy = new GiteaStrategy();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should authenticate user', async () => {
    const result = await strategy.authenticate('username', 'password');
    expect(result).toHaveProperty('token');
  });

  it('should handle errors', async () => {
    await expect(strategy.authenticate('wrongUser', 'wrongPass')).rejects.toThrow();
  });
});