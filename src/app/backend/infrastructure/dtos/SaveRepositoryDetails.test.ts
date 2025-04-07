import { SaveRepositoryDetails } from './SaveRepositoryDetails';

describe('SaveRepositoryDetails', () => {
  it('should create an instance with valid data', () => {
    const details = new SaveRepositoryDetails('repoName', 'repoDescription');
    expect(details.name).toBe('repoName');
    expect(details.description).toBe('repoDescription');
  });

  it('should throw an error if name is missing', () => {
    expect(() => new SaveRepositoryDetails('', 'repoDescription')).toThrowError('Name is required');
  });

  it('should throw an error if description is missing', () => {
    expect(() => new SaveRepositoryDetails('repoName', '')).toThrowError('Description is required');
  });
});