import { surfaceFunction } from './surfaces';

describe('surfaceFunction', () => {
  it('should return expected surface', () => {
    const input = 'testInput';
    const expectedOutput = 'expectedOutput';
    expect(surfaceFunction(input)).toEqual(expectedOutput);
  });
});