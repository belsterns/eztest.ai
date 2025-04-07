import { GiteaProvider } from './GiteaProvider';

describe('GiteaProvider', () => {
  let giteaProvider;

  beforeEach(() => {
    giteaProvider = new GiteaProvider();
  });

  test('should initialize correctly', () => {
    expect(giteaProvider).toBeDefined();
  });

  test('should fetch repositories', async () => {
    const repos = await giteaProvider.fetchRepositories();
    expect(repos).toBeInstanceOf(Array);
  });

  test('should handle errors when fetching repositories', async () => {
    jest.spyOn(giteaProvider, 'fetchRepositories').mockImplementation(() => {
      throw new Error('Fetch error');
    });
    await expect(giteaProvider.fetchRepositories()).rejects.toThrow('Fetch error');
  });
});