import { yourFunction } from './index';

describe('yourFunction', () => {
  it('should return expected result when condition X', () => {
    const result = yourFunction(input);
    expect(result).toEqual(expectedOutput);
  });

  it('should handle error case Y', () => {
    expect(() => yourFunction(invalidInput)).toThrow(Error);
  });
});