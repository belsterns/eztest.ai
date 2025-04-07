import { FolderPathDtoRequest } from './FolderPathDtoRequest';

describe('FolderPathDtoRequest', () => {
  it('should create an instance with valid properties', () => {
    const dto = new FolderPathDtoRequest('/some/path');
    expect(dto.path).toBe('/some/path');
  });

  it('should throw an error if path is invalid', () => {
    expect(() => new FolderPathDtoRequest('')).toThrow('Invalid path');
  });
});