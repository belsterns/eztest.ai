import { GitHubProvider } from '../GitHubProvider';

describe('GitHubProvider', () => {
  let provider;

  beforeEach(() => {
    provider = new GitHubProvider();
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  it('should fetch repositories', async () => {
    const repos = await provider.fetchRepositories();
    expect(repos).toBeInstanceOf(Array);
  });

  it('should handle errors', async () => {
    jest.spyOn(provider, 'fetchRepositories').mockImplementation(() => {
      throw new Error('Fetch error');
    });
    await expect(provider.fetchRepositories()).rejects.toThrow('Fetch error');
  });
});