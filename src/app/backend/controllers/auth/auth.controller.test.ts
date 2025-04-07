import { AuthController } from './auth.controller';
import { Request, Response } from 'express';

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(() => {
    authController = new AuthController();
  });

  describe('login', () => {
    it('should return a token on successful login', async () => {
      const req = { body: { username: 'test', password: 'test' } } as Request;
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as unknown as Response;

      await authController.login(req, res);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ token: expect.any(String) }));
    });

    it('should return 401 for invalid credentials', async () => {
      const req = { body: { username: 'wrong', password: 'wrong' } } as Request;
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as unknown as Response;

      await authController.login(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });
  });

  describe('register', () => {
    it('should create a new user and return success message', async () => {
      const req = { body: { username: 'newUser', password: 'newPass' } } as Request;
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as unknown as Response;

      await authController.register(req, res);
      expect(res.json).toHaveBeenCalledWith({ message: 'User created successfully' });
    });
  });
});