import { GitHubStrategy } from './GitHubStrategy';

describe('GitHubStrategy', () => {
  let strategy: GitHubStrategy;

  beforeEach(() => {
    strategy = new GitHubStrategy();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should authenticate user', async () => {
    const user = await strategy.authenticate('token');
    expect(user).toHaveProperty('id');
  });

  it('should handle errors', async () => {
    await expect(strategy.authenticate('invalid_token')).rejects.toThrow(Error);
  });
});