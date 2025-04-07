import { CreateNewFileRequestDto } from './CreateNewFileRequestDto';

describe('CreateNewFileRequestDto', () => {
  it('should create an instance with valid properties', () => {
    const dto = new CreateNewFileRequestDto('filename.txt', 'text/plain', 'Sample content');
    expect(dto.filename).toBe('filename.txt');
    expect(dto.mimeType).toBe('text/plain');
    expect(dto.content).toBe('Sample content');
  });

  it('should throw an error if filename is missing', () => {
    expect(() => new CreateNewFileRequestDto('', 'text/plain', 'Sample content')).toThrowError('Filename is required');
  });

  it('should throw an error if mimeType is missing', () => {
    expect(() => new CreateNewFileRequestDto('filename.txt', '', 'Sample content')).toThrowError('MIME type is required');
  });

  it('should throw an error if content is missing', () => {
    expect(() => new CreateNewFileRequestDto('filename.txt', 'text/plain', '')).toThrowError('Content is required');
  });
});