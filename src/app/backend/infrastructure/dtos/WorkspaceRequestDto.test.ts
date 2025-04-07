import { WorkspaceRequestDto } from './WorkspaceRequestDto';

describe('WorkspaceRequestDto', () => {
  it('should create an instance with valid properties', () => {
    const dto = new WorkspaceRequestDto({ /* valid properties */ });
    expect(dto).toBeInstanceOf(WorkspaceRequestDto);
    expect(dto.propertyName).toEqual('expectedValue');
  });

  it('should throw an error for invalid properties', () => {
    expect(() => new WorkspaceRequestDto({ /* invalid properties */ })).toThrowError();
  });
});