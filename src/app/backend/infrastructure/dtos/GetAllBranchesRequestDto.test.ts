import { GetAllBranchesRequestDto } from './GetAllBranchesRequestDto';

describe('GetAllBranchesRequestDto', () => {
  it('should create an instance', () => {
    const dto = new GetAllBranchesRequestDto();
    expect(dto).toBeTruthy();
  });

  it('should have the expected properties', () => {
    const dto = new GetAllBranchesRequestDto();
    expect(dto).toHaveProperty('propertyName'); // replace with actual properties
  });
});