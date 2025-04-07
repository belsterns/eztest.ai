import { RepositoryVerificationValidator } from '../RepositoryVerificationValidator';

describe('RepositoryVerificationValidator', () => {
  let validator;

  beforeEach(() => {
    validator = new RepositoryVerificationValidator();
  });

  test('should validate repository correctly', () => {
    const result = validator.validate(someRepositoryData);
    expect(result).toBe(true);
  });

  test('should throw error for invalid repository', () => {
    expect(() => validator.validate(invalidRepositoryData)).toThrow(Error);
  });
});