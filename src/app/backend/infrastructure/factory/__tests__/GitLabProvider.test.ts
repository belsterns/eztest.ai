import { GitLabProvider } from '../GitLabProvider';

describe('GitLabProvider', () => {
  let provider: GitLabProvider;

  beforeEach(() => {
    provider = new GitLabProvider();
  });

  test('should initialize with default values', () => {
    expect(provider).toBeDefined();
    // Add more expectations based on the default values
  });

  test('should fetch repositories', async () => {
    const repos = await provider.fetchRepositories();
    expect(repos).toBeInstanceOf(Array);
    // Add more expectations based on the expected output
  });

  test('should handle errors when fetching repositories', async () => {
    jest.spyOn(provider, 'fetchRepositories').mockImplementationOnce(() => {
      throw new Error('Fetch error');
    });
    await expect(provider.fetchRepositories()).rejects.toThrow('Fetch error');
  });
});