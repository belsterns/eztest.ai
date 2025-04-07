import { GitLabWebhookHandler } from '../GitLabWebhookHandler';

describe('GitLabWebhookHandler', () => {
  let handler: GitLabWebhookHandler;

  beforeEach(() => {
    handler = new GitLabWebhookHandler();
  });

  test('should process webhook event correctly', () => {
    const event = { /* mock event data */ };
    const result = handler.handle(event);
    expect(result).toEqual(/* expected result */);
  });

  test('should throw error for invalid event', () => {
    const invalidEvent = { /* mock invalid event data */ };
    expect(() => handler.handle(invalidEvent)).toThrowError();
  });
});