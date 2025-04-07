import { UpdateExistingFileRequestDto } from './UpdateExistingFileRequestDto';

describe('UpdateExistingFileRequestDto', () => {
  it('should create an instance', () => {
    const dto = new UpdateExistingFileRequestDto();
    expect(dto).toBeTruthy();
  });

  it('should have the expected properties', () => {
    const dto = new UpdateExistingFileRequestDto();
    expect(dto).toHaveProperty('propertyName'); // replace with actual property names
  });
});