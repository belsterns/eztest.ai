import { encrypt, decrypt } from '../cryptoUtils';

describe('Crypto Utils', () => {
  const testData = 'Hello, World!';
  const key = 'my-secret-key';

  test('should encrypt data', () => {
    const encrypted = encrypt(testData, key);
    expect(encrypted).not.toBe(testData);
  });

  test('should decrypt data', () => {
    const encrypted = encrypt(testData, key);
    const decrypted = decrypt(encrypted, key);
    expect(decrypted).toBe(testData);
  });

  test('should throw error on invalid key', () => {
    const invalidKey = 'invalid-key';
    const encrypted = encrypt(testData, key);
    expect(() => decrypt(encrypted, invalidKey)).toThrowError();
  });
});