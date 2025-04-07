import { customizations } from './index';

describe('customizations', () => {
  it('should return default customizations', () => {
    const result = customizations();
    expect(result).toEqual(expect.any(Object));
  });

  // Add more tests as needed
});