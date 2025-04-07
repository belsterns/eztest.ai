import { FetchModifiedFilesRequestDto } from './FetchModifiedFilesRequestDto';

describe('FetchModifiedFilesRequestDto', () => {
  it('should create an instance with valid properties', () => {
    const dto = new FetchModifiedFilesRequestDto({ /* valid properties */ });
    expect(dto).toBeInstanceOf(FetchModifiedFilesRequestDto);
    // Add more assertions based on the properties
  });

  it('should throw an error for invalid properties', () => {
    expect(() => new FetchModifiedFilesRequestDto({ /* invalid properties */ })).toThrowError();
  });
});