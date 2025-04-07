import { RepositoryVerificationValidator } from '../RepositoryVerificationValidator';

describe('RepositoryVerificationValidator', () => {
  let validator: RepositoryVerificationValidator;

  beforeEach(() => {
    validator = new RepositoryVerificationValidator();
  });

  test('should validate repository correctly', () => {
    const result = validator.validate('valid-repo');
    expect(result).toBe(true);
  });

  test('should invalidate repository with invalid name', () => {
    const result = validator.validate('invalid repo!');
    expect(result).toBe(false);
  });

  test('should throw error for null input', () => {
    expect(() => validator.validate(null)).toThrow(Error);
  });
});