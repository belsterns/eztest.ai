import { WorkspaceValidator } from '../WorkspaceValidator';

describe('WorkspaceValidator', () => {
  let validator: WorkspaceValidator;

  beforeEach(() => {
    validator = new WorkspaceValidator();
  });

  test('should validate workspace correctly', () => {
    const result = validator.validate({/* mock workspace data */});
    expect(result).toBe(true);
  });

  test('should return error for invalid workspace', () => {
    const result = validator.validate({/* mock invalid workspace data */});
    expect(result).toEqual({ error: 'Invalid workspace' });
  });
});