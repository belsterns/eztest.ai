import { sign, verify } from './jwt';

describe('JWT Helper', () => {
  const secret = 'test_secret';
  const payload = { userId: 1 };

  test('should sign a payload and return a token', () => {
    const token = sign(payload, secret);
    expect(token).toBeDefined();
  });

  test('should verify a valid token', () => {
    const token = sign(payload, secret);
    const verifiedPayload = verify(token, secret);
    expect(verifiedPayload).toEqual(payload);
  });

  test('should throw an error for an invalid token', () => {
    expect(() => verify('invalid_token', secret)).toThrowError();
  });
});