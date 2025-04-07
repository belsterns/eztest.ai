import { GitProviderFactory } from '../GitProviderFactory';

describe('GitProviderFactory', () => {
  it('should create a GitHub provider', () => {
    const factory = new GitProviderFactory();
    const provider = factory.create('github');
    expect(provider).toBeDefined();
    expect(provider.name).toBe('GitHub');
  });

  it('should create a GitLab provider', () => {
    const factory = new GitProviderFactory();
    const provider = factory.create('gitlab');
    expect(provider).toBeDefined();
    expect(provider.name).toBe('GitLab');
  });

  it('should throw an error for unknown provider', () => {
    const factory = new GitProviderFactory();
    expect(() => factory.create('unknown')).toThrow('Unknown Git provider');
  });
});