import { GitLabWebhookHandler } from '../GitLabWebhookHandler';

describe('GitLabWebhookHandler', () => {
  let handler: GitLabWebhookHandler;

  beforeEach(() => {
    handler = new GitLabWebhookHandler();
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should handle webhook events', async () => {
    const event = { /* mock event data */ };
    const response = await handler.handleEvent(event);
    expect(response).toEqual({ /* expected response */ });
  });

  it('should throw an error for invalid events', async () => {
    const invalidEvent = { /* mock invalid event data */ };
    await expect(handler.handleEvent(invalidEvent)).rejects.toThrow();
  });
});