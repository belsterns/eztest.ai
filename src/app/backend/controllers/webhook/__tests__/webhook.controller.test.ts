import { webhookController } from '../webhook.controller';

describe('webhookController', () => {
  it('should handle valid webhook events', async () => {
    const req = { body: { event: 'valid_event' } };
    const res = { send: jest.fn() };
    await webhookController(req, res);
    expect(res.send).toHaveBeenCalledWith({ success: true });
  });

  it('should return error for invalid webhook events', async () => {
    const req = { body: { event: 'invalid_event' } };
    const res = { send: jest.fn() };
    await webhookController(req, res);
    expect(res.send).toHaveBeenCalledWith({ success: false, error: 'Invalid event' });
  });
});