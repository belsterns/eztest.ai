import { AuthController } from './auth.controller';
import { Request, Response } from 'express';

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(() => {
    authController = new AuthController();
  });

  describe('login', () => {
    it('should return a token for valid credentials', async () => {
      const req = { body: { username: 'test', password: 'test' } } as Request;
      const res = { json: jest.fn() } as unknown as Response;
      await authController.login(req, res);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ token: expect.any(String) }));
    });

    it('should return an error for invalid credentials', async () => {
      const req = { body: { username: 'invalid', password: 'invalid' } } as Request;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
      await authController.login(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
    });
  });

  describe('register', () => {
    it('should create a new user and return success', async () => {
      const req = { body: { username: 'newUser', password: 'newPass' } } as Request;
      const res = { json: jest.fn() } as unknown as Response;
      await authController.register(req, res);
      expect(res.json).toHaveBeenCalledWith({ message: 'User created successfully' });
    });
  });
});