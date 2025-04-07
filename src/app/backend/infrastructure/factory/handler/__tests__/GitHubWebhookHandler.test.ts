import { GitHubWebhookHandler } from '../GitHubWebhookHandler';

describe('GitHubWebhookHandler', () => {
  let handler: GitHubWebhookHandler;

  beforeEach(() => {
    handler = new GitHubWebhookHandler();
  });

  test('should handle push event', () => {
    const event = { action: 'push', repository: { name: 'test-repo' } };
    const result = handler.handle(event);
    expect(result).toEqual({ success: true });
  });

  test('should handle pull request event', () => {
    const event = { action: 'opened', pull_request: { title: 'test PR' } };
    const result = handler.handle(event);
    expect(result).toEqual({ success: true });
  });

  test('should return error for unknown event', () => {
    const event = { action: 'unknown' };
    const result = handler.handle(event);
    expect(result).toEqual({ success: false, message: 'Unknown event type' });
  });
});