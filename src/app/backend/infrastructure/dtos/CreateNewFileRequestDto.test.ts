import { CreateNewFileRequestDto } from './CreateNewFileRequestDto';

describe('CreateNewFileRequestDto', () => {
  it('should create an instance', () => {
    const dto = new CreateNewFileRequestDto();
    expect(dto).toBeTruthy();
  });

  it('should have the required properties', () => {
    const dto = new CreateNewFileRequestDto();
    expect(dto).toHaveProperty('propertyName'); // replace with actual property names
  });
});