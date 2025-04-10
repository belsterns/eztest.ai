import { fullRepoWebhookHandler } from '../fullRepoWebhook.controller';

describe('fullRepoWebhookHandler', () => {
  it('should process the webhook correctly', async () => {
    const req = { /* mock request object */ };
    const res = { /* mock response object */ };
    await fullRepoWebhookHandler(req, res);
    // Add assertions to verify the response
  });

  it('should handle errors gracefully', async () => {
    const req = { /* mock request object that triggers an error */ };
    const res = { /* mock response object */ };
    await fullRepoWebhookHandler(req, res);
    // Add assertions to verify error handling
  });
});