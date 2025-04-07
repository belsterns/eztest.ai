import { GitLabStrategy } from './GitLabStrategy';

describe('GitLabStrategy', () => {
  let strategy: GitLabStrategy;

  beforeEach(() => {
    strategy = new GitLabStrategy();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should perform authentication correctly', async () => {
    const result = await strategy.authenticate();
    expect(result).toHaveProperty('token');
  });

  it('should handle errors during authentication', async () => {
    jest.spyOn(strategy, 'authenticate').mockImplementationOnce(() => { throw new Error('Authentication failed'); });
    await expect(strategy.authenticate()).rejects.toThrow('Authentication failed');
  });
});