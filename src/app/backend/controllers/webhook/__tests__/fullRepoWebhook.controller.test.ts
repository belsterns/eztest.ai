import { fullRepoWebhookHandler } from '../fullRepoWebhook.controller';

describe('fullRepoWebhookHandler', () => {
  it('should handle webhook events correctly', async () => {
    const req = { body: { /* mock request body */ } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await fullRepoWebhookHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true });
  });

  it('should return 400 for invalid events', async () => {
    const req = { body: { /* mock invalid request body */ } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await fullRepoWebhookHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Invalid event' });
  });
});