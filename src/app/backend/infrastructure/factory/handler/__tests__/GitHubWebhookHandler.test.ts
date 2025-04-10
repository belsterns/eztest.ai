import { GitHubWebhookHandler } from '../GitHubWebhookHandler';

describe('GitHubWebhookHandler', () => {
  let handler: GitHubWebhookHandler;

  beforeEach(() => {
    handler = new GitHubWebhookHandler();
  });

  it('should handle push events correctly', () => {
    const event = { /* mock push event data */ };
    const result = handler.handleEvent(event);
    expect(result).toEqual(/* expected result */);
  });

  it('should handle pull request events correctly', () => {
    const event = { /* mock pull request event data */ };
    const result = handler.handleEvent(event);
    expect(result).toEqual(/* expected result */);
  });

  it('should throw an error for unsupported events', () => {
    const event = { /* mock unsupported event data */ };
    expect(() => handler.handleEvent(event)).toThrowError('Unsupported event type');
  });
});