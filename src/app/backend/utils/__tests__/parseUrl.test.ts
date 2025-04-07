import { parseUrl } from '../parseUrl';

describe('parseUrl', () => {
  it('should parse a valid URL correctly', () => {
    const url = 'https://example.com/path?query=1';
    const result = parseUrl(url);
    expect(result).toEqual({
      protocol: 'https',
      host: 'example.com',
      pathname: '/path',
      search: '?query=1'
    });
  });

  it('should return null for an invalid URL', () => {
    const url = 'invalid-url';
    const result = parseUrl(url);
    expect(result).toBeNull();
  });

  it('should handle URLs without a protocol', () => {
    const url = 'example.com/path';
    const result = parseUrl(url);
    expect(result).toEqual({
      protocol: null,
      host: 'example.com',
      pathname: '/path',
      search: null
    });
  });
});