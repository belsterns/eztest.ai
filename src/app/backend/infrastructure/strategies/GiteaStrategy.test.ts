import { GiteaStrategy } from './GiteaStrategy';

describe('GiteaStrategy', () => {
  let strategy: GiteaStrategy;

  beforeEach(() => {
    strategy = new GiteaStrategy();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should perform authentication correctly', async () => {
    const result = await strategy.authenticate('username', 'password');
    expect(result).toHaveProperty('token');
  });

  it('should handle errors during authentication', async () => {
    await expect(strategy.authenticate('wrongUser', 'wrongPass')).rejects.toThrow();
  });
});