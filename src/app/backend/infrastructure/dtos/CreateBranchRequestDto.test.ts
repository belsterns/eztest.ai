import { CreateBranchRequestDto } from './CreateBranchRequestDto';

describe('CreateBranchRequestDto', () => {
  it('should create an instance with valid properties', () => {
    const dto = new CreateBranchRequestDto('branchName', 'branchDescription');
    expect(dto.name).toBe('branchName');
    expect(dto.description).toBe('branchDescription');
  });

  it('should throw an error if name is missing', () => {
    expect(() => new CreateBranchRequestDto('', 'branchDescription')).toThrowError('Name is required');
  });

  it('should throw an error if description is missing', () => {
    expect(() => new CreateBranchRequestDto('branchName', '')).toThrowError('Description is required');
  });
});