import { UpdateRepositoryDetails } from '../UpdateRepositoryDetails';

describe('UpdateRepositoryDetails', () => {
  it('should create an instance with valid properties', () => {
    const details = new UpdateRepositoryDetails('repoName', 'repoDescription');
    expect(details.name).toBe('repoName');
    expect(details.description).toBe('repoDescription');
  });

  it('should throw an error if name is missing', () => {
    expect(() => new UpdateRepositoryDetails('', 'repoDescription')).toThrowError('Name is required');
  });

  it('should throw an error if description is missing', () => {
    expect(() => new UpdateRepositoryDetails('repoName', '')).toThrowError('Description is required');
  });
});