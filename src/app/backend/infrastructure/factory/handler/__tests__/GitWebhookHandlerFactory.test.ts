import { GitWebhookHandlerFactory } from '../GitWebhookHandlerFactory';

describe('GitWebhookHandlerFactory', () => {
  it('should create a handler for valid webhook events', () => {
    const factory = new GitWebhookHandlerFactory();
    const handler = factory.createHandler('push');
    expect(handler).toBeDefined();
    expect(handler.handle).toBeInstanceOf(Function);
  });

  it('should throw an error for unsupported events', () => {
    const factory = new GitWebhookHandlerFactory();
    expect(() => factory.createHandler('unsupported')).toThrow(Error);
  });
});