import { EmailController } from './email.controller';

describe('EmailController', () => {
  let emailController: EmailController;

  beforeEach(() => {
    emailController = new EmailController();
  });

  it('should send an email successfully', async () => {
    const response = await emailController.sendEmail({
      to: 'test@example.com',
      subject: 'Test Subject',
      body: 'Test Body'
    });
    expect(response).toEqual({ success: true });
  });

  it('should throw an error for invalid email', async () => {
    await expect(emailController.sendEmail({
      to: 'invalid-email',
      subject: 'Test Subject',
      body: 'Test Body'
    })).rejects.toThrow('Invalid email address');
  });
});