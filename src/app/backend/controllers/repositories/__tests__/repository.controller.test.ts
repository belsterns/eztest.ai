import { Request, Response } from 'express';
import { getRepository, createRepository, updateRepository, deleteRepository } from '../repository.controller';

jest.mock('../repository.service');

describe('Repository Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {};
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  test('should get a repository', async () => {
    req.params = { id: '1' };
    await getRepository(req as Request, res as Response);
    expect(res.json).toHaveBeenCalled();
  });

  test('should create a repository', async () => {
    req.body = { name: 'New Repository' };
    await createRepository(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });

  test('should update a repository', async () => {
    req.params = { id: '1' };
    req.body = { name: 'Updated Repository' };
    await updateRepository(req as Request, res as Response);
    expect(res.json).toHaveBeenCalled();
  });

  test('should delete a repository', async () => {
    req.params = { id: '1' };
    await deleteRepository(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(204);
  });
});