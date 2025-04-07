import { FetchFileContentRequestDto } from './FetchFileContentRequestDto';

describe('FetchFileContentRequestDto', () => {
  it('should create an instance with valid properties', () => {
    const dto = new FetchFileContentRequestDto('filePath', 'userId');
    expect(dto.filePath).toBe('filePath');
    expect(dto.userId).toBe('userId');
  });

  it('should throw an error if filePath is missing', () => {
    expect(() => new FetchFileContentRequestDto('', 'userId')).toThrowError('filePath is required');
  });

  it('should throw an error if userId is missing', () => {
    expect(() => new FetchFileContentRequestDto('filePath', '')).toThrowError('userId is required');
  });
});