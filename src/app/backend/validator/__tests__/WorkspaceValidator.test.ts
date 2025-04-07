import { WorkspaceValidator } from '../WorkspaceValidator';

describe('WorkspaceValidator', () => {
  let validator: WorkspaceValidator;

  beforeEach(() => {
    validator = new WorkspaceValidator();
  });

  test('should validate workspace correctly', () => {
    const result = validator.validate({ /* mock workspace data */ });
    expect(result).toBe(true); // or false based on your validation logic
  });

  test('should throw error for invalid workspace', () => {
    expect(() => validator.validate({ /* invalid workspace data */ })).toThrow();
  });
});