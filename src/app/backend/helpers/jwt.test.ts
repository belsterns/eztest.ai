import { sign, verify } from './jwt';

describe('JWT Helper', () => {
  const secret = 'test_secret';
  const payload = { userId: 1 };

  it('should sign a token', () => {
    const token = sign(payload, secret);
    expect(token).toBeDefined();
  });

  it('should verify a token', () => {
    const token = sign(payload, secret);
    const verifiedPayload = verify(token, secret);
    expect(verifiedPayload).toEqual(payload);
  });

  it('should throw error on invalid token', () => {
    expect(() => verify('invalid_token', secret)).toThrow();
  });
});