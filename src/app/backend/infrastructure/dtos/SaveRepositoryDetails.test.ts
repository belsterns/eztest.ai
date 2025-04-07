import { SaveRepositoryDetails } from './SaveRepositoryDetails';

describe('SaveRepositoryDetails', () => {
  it('should create an instance with correct properties', () => {
    const details = new SaveRepositoryDetails('repoName', 'repoDescription');
    expect(details.name).toBe('repoName');
    expect(details.description).toBe('repoDescription');
  });

  it('should throw an error if name is missing', () => {
    expect(() => new SaveRepositoryDetails('', 'repoDescription')).toThrow('Name is required');
  });

  it('should throw an error if description is missing', () => {
    expect(() => new SaveRepositoryDetails('repoName', '')).toThrow('Description is required');
  });
});