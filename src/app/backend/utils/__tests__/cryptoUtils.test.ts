import { encrypt, decrypt } from '../cryptoUtils';

describe('Crypto Utils', () => {
  const secretKey = 'mySecretKey';
  const data = 'Hello, World!';

  test('should encrypt data', () => {
    const encryptedData = encrypt(data, secretKey);
    expect(encryptedData).not.toBe(data);
  });

  test('should decrypt data', () => {
    const encryptedData = encrypt(data, secretKey);
    const decryptedData = decrypt(encryptedData, secretKey);
    expect(decryptedData).toBe(data);
  });

  test('should throw error on invalid key', () => {
    const encryptedData = encrypt(data, secretKey);
    expect(() => decrypt(encryptedData, 'wrongKey')).toThrow();
  });
});