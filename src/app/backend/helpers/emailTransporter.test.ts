import { createTransport } from 'nodemailer';
import { emailTransporter } from './emailTransporter';

describe('emailTransporter', () => {
  it('should create a transport object', () => {
    const transporter = emailTransporter();
    expect(transporter).toBeDefined();
    expect(transporter).toHaveProperty('sendMail');
  });

  it('should send an email', async () => {
    const transporter = emailTransporter();
    const info = await transporter.sendMail({
      from: 'test@example.com',
      to: 'recipient@example.com',
      subject: 'Test Email',
      text: 'This is a test email',
    });
    expect(info).toHaveProperty('messageId');
  });
});