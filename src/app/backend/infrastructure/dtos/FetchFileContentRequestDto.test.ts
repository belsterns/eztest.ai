import { FetchFileContentRequestDto } from './FetchFileContentRequestDto';

describe('FetchFileContentRequestDto', () => {
  it('should create an instance with valid properties', () => {
    const dto = new FetchFileContentRequestDto('filePath', 'fileType');
    expect(dto.filePath).toBe('filePath');
    expect(dto.fileType).toBe('fileType');
  });

  it('should throw an error if filePath is missing', () => {
    expect(() => new FetchFileContentRequestDto('', 'fileType')).toThrowError('filePath is required');
  });

  it('should throw an error if fileType is missing', () => {
    expect(() => new FetchFileContentRequestDto('filePath', '')).toThrowError('fileType is required');
  });
});