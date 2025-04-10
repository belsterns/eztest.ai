import { baseInterceptor } from '../baseInterceptor';

describe('baseInterceptor', () => {
  it('should perform the expected behavior', () => {
    // Arrange
    const input = {}; // Define your input
    const expectedOutput = {}; // Define your expected output

    // Act
    const result = baseInterceptor(input);

    // Assert
    expect(result).toEqual(expectedOutput);
  });
});