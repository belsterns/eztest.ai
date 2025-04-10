import { themePrimitives } from './themePrimitives';

describe('themePrimitives', () => {
  it('should have the expected properties', () => {
    expect(themePrimitives).toHaveProperty('color');
    expect(themePrimitives).toHaveProperty('fontSize');
    // Add more property checks as needed
  });

  it('should return the correct theme values', () => {
    const expectedValues = {
      color: 'blue',
      fontSize: '16px',
      // Add more expected values as needed
    };
    expect(themePrimitives).toEqual(expect.objectContaining(expectedValues));
  });
});