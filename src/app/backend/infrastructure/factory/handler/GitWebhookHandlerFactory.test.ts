import { GitWebhookHandlerFactory } from './GitWebhookHandlerFactory';

describe('GitWebhookHandlerFactory', () => {
  it('should create a handler for GitHub webhooks', () => {
    const factory = new GitWebhookHandlerFactory();
    const handler = factory.create('github');
    expect(handler).toBeDefined();
    expect(handler.handle).toBeInstanceOf(Function);
  });

  it('should create a handler for GitLab webhooks', () => {
    const factory = new GitWebhookHandlerFactory();
    const handler = factory.create('gitlab');
    expect(handler).toBeDefined();
    expect(handler.handle).toBeInstanceOf(Function);
  });

  it('should throw an error for unsupported webhook types', () => {
    const factory = new GitWebhookHandlerFactory();
    expect(() => factory.create('unsupported')).toThrow(Error);
  });
});