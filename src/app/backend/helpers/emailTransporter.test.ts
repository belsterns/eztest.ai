import { createTransport } from 'nodemailer';
import { emailTransporter } from './emailTransporter';

describe('emailTransporter', () => {
  it('should create a transport object', () => {
    const transporter = emailTransporter();
    expect(transporter).toBeDefined();
    expect(transporter.sendMail).toBeDefined();
  });

  it('should send an email', async () => {
    const transporter = emailTransporter();
    const mailOptions = {
      from: 'test@example.com',
      to: 'recipient@example.com',
      subject: 'Test Email',
      text: 'This is a test email.'
    };
    const response = await transporter.sendMail(mailOptions);
    expect(response).toHaveProperty('accepted');
    expect(response.accepted).toContain('recipient@example.com');
  });
});