import { GitHubProvider } from '../GitHubProvider';

describe('GitHubProvider', () => {
  let provider: GitHubProvider;

  beforeEach(() => {
    provider = new GitHubProvider();
  });

  test('should initialize correctly', () => {
    expect(provider).toBeDefined();
  });

  test('should fetch repositories', async () => {
    const repos = await provider.fetchRepositories();
    expect(repos).toBeInstanceOf(Array);
  });

  test('should handle errors when fetching repositories', async () => {
    jest.spyOn(provider, 'fetchRepositories').mockImplementationOnce(() => {
      throw new Error('Fetch error');
    });
    await expect(provider.fetchRepositories()).rejects.toThrow('Fetch error');
  });
});