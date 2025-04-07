import { handler } from './route';
import { createMockRequest, createMockResponse } from 'mock-req-res';

describe('Workspace List Route', () => {
  it('should return a list of workspaces', async () => {
    const req = createMockRequest();
    const res = createMockResponse();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.any(Array));
  });

  it('should handle errors', async () => {
    const req = createMockRequest();
    const res = createMockResponse();
    // Simulate an error
    jest.spyOn(SomeService, 'getWorkspaces').mockImplementationOnce(() => {
      throw new Error('Error fetching workspaces');
    });
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error fetching workspaces' });
  });
});