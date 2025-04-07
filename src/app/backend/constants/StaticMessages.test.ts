import { StaticMessages } from './StaticMessages';

describe('StaticMessages', () => {
  it('should have defined messages', () => {
    expect(StaticMessages).toBeDefined();
  });

  it('should contain specific message keys', () => {
    const expectedKeys = ['WELCOME_MESSAGE', 'ERROR_MESSAGE', 'SUCCESS_MESSAGE'];
    expectedKeys.forEach(key => {
      expect(StaticMessages).toHaveProperty(key);
    });
  });
});