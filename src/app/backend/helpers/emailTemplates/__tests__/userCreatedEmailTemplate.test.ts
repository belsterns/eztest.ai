import { userCreatedEmailTemplate } from '../userCreatedEmailTemplate';

describe('userCreatedEmailTemplate', () => {
  it('should return a valid email template for a new user', () => {
    const user = { name: 'John Doe', email: 'john@example.com' };
    const result = userCreatedEmailTemplate(user);
    expect(result).toContain('Welcome, John Doe');
    expect(result).toContain('Thank you for joining us!');
    expect(result).toContain('john@example.com');
  });

  it('should handle missing user name', () => {
    const user = { email: 'john@example.com' };
    const result = userCreatedEmailTemplate(user);
    expect(result).toContain('Welcome, Guest');
  });

  it('should handle missing user email', () => {
    const user = { name: 'John Doe' };
    const result = userCreatedEmailTemplate(user);
    expect(result).toContain('Welcome, John Doe');
    expect(result).toContain('Thank you for joining us!');
    expect(result).toContain('No email provided');
  });
});