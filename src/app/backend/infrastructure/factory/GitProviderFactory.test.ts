import { GitProviderFactory } from './GitProviderFactory';
import { GitHubProvider } from '../providers/GitHubProvider';
import { GitLabProvider } from '../providers/GitLabProvider';

describe('GitProviderFactory', () => {
  it('should create a GitHubProvider when type is github', () => {
    const factory = new GitProviderFactory();
    const provider = factory.create('github');
    expect(provider).toBeInstanceOf(GitHubProvider);
  });

  it('should create a GitLabProvider when type is gitlab', () => {
    const factory = new GitProviderFactory();
    const provider = factory.create('gitlab');
    expect(provider).toBeInstanceOf(GitLabProvider);
  });

  it('should throw an error for an unknown provider type', () => {
    const factory = new GitProviderFactory();
    expect(() => factory.create('unknown')).toThrow(Error);
  });
});