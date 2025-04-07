import { handler } from './route';

describe('Webhook Route', () => {
  it('should return 200 for valid webhook UUID', async () => {
    const req = { params: { webhook_uuid: 'valid-uuid' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('should return 404 for invalid webhook UUID', async () => {
    const req = { params: { webhook_uuid: 'invalid-uuid' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});