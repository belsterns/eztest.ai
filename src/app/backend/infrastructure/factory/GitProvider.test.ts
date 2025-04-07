import { GitProvider } from './GitProvider';

describe('GitProvider', () => {
  let gitProvider;

  beforeEach(() => {
    gitProvider = new GitProvider();
  });

  test('should initialize correctly', () => {
    expect(gitProvider).toBeDefined();
  });

  test('should fetch repositories', async () => {
    const repos = await gitProvider.fetchRepositories();
    expect(repos).toBeInstanceOf(Array);
  });

  test('should handle errors when fetching repositories', async () => {
    jest.spyOn(gitProvider, 'fetchRepositories').mockImplementationOnce(() => {
      throw new Error('Fetch error');
    });
    await expect(gitProvider.fetchRepositories()).rejects.toThrow('Fetch error');
  });
});