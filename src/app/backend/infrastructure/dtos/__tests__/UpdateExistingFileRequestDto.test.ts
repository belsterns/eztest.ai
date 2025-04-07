import { UpdateExistingFileRequestDto } from '../UpdateExistingFileRequestDto';

describe('UpdateExistingFileRequestDto', () => {
  it('should create an instance with valid properties', () => {
    const dto = new UpdateExistingFileRequestDto({
      property1: 'value1',
      property2: 'value2',
    });
    expect(dto.property1).toBe('value1');
    expect(dto.property2).toBe('value2');
  });

  it('should throw an error for invalid properties', () => {
    expect(() => new UpdateExistingFileRequestDto({
      property1: null,
      property2: 'value2',
    })).toThrowError('Invalid property1');
  });
});