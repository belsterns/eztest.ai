import { themePrimitives } from './themePrimitives';

describe('themePrimitives', () => {
  it('should have default values', () => {
    expect(themePrimitives).toHaveProperty('color');
    expect(themePrimitives).toHaveProperty('fontSize');
  });

  it('should return correct theme values', () => {
    const expectedValues = { color: '#000', fontSize: '16px' };
    expect(themePrimitives.color).toEqual(expectedValues.color);
    expect(themePrimitives.fontSize).toEqual(expectedValues.fontSize);
  });
});