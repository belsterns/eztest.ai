import { WorkspaceRequestDto } from '../WorkspaceRequestDto';

describe('WorkspaceRequestDto', () => {
  it('should create an instance with valid properties', () => {
    const dto = new WorkspaceRequestDto({ name: 'Test Workspace', description: 'A test workspace' });
    expect(dto.name).toBe('Test Workspace');
    expect(dto.description).toBe('A test workspace');
  });

  it('should throw an error if name is missing', () => {
    expect(() => new WorkspaceRequestDto({ description: 'A test workspace' })).toThrowError('Name is required');
  });

  it('should throw an error if description is missing', () => {
    expect(() => new WorkspaceRequestDto({ name: 'Test Workspace' })).toThrowError('Description is required');
  });
});