import { CreateBranchRequestDto } from './CreateBranchRequestDto';

describe('CreateBranchRequestDto', () => {
  it('should create an instance with valid properties', () => {
    const dto = new CreateBranchRequestDto('branchName', 'description');
    expect(dto.branchName).toBe('branchName');
    expect(dto.description).toBe('description');
  });

  it('should throw an error if branchName is missing', () => {
    expect(() => new CreateBranchRequestDto('', 'description')).toThrowError('branchName is required');
  });

  it('should throw an error if description is missing', () => {
    expect(() => new CreateBranchRequestDto('branchName', '')).toThrowError('description is required');
  });
});