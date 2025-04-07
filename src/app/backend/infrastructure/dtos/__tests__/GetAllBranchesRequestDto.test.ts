import { GetAllBranchesRequestDto } from '../GetAllBranchesRequestDto';

describe('GetAllBranchesRequestDto', () => {
  it('should create an instance with valid properties', () => {
    const dto = new GetAllBranchesRequestDto();
    expect(dto).toBeInstanceOf(GetAllBranchesRequestDto);
  });

  it('should validate required fields', () => {
    const dto = new GetAllBranchesRequestDto();
    expect(dto.someRequiredField).toBeDefined();
  });
});