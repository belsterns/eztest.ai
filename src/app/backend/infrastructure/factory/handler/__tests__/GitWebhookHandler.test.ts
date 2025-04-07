import { GitWebhookHandler } from '../GitWebhookHandler';

describe('GitWebhookHandler', () => {
  let handler: GitWebhookHandler;

  beforeEach(() => {
    handler = new GitWebhookHandler();
  });

  test('should handle a valid webhook event', () => {
    const event = { /* mock event data */ };
    const response = handler.handleEvent(event);
    expect(response).toEqual({ /* expected response */ });
  });

  test('should throw an error for invalid event', () => {
    const event = { /* mock invalid event data */ };
    expect(() => handler.handleEvent(event)).toThrowError('Invalid event');
  });
});