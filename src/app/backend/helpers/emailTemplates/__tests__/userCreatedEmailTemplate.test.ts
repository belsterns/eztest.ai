import { userCreatedEmailTemplate } from '../userCreatedEmailTemplate';

describe('userCreatedEmailTemplate', () => {
  it('should return the correct email template for a new user', () => {
    const user = { name: 'John Doe', email: 'john@example.com' };
    const expectedOutput = `Hello John Doe,\n\nWelcome to our platform! We're glad to have you.\n\nBest,\nThe Team`;
    expect(userCreatedEmailTemplate(user)).toEqual(expectedOutput);
  });

  it('should handle missing user name', () => {
    const user = { email: 'john@example.com' };
    const expectedOutput = `Hello,\n\nWelcome to our platform! We're glad to have you.\n\nBest,\nThe Team`;
    expect(userCreatedEmailTemplate(user)).toEqual(expectedOutput);
  });

  it('should handle missing user email', () => {
    const user = { name: 'John Doe' };
    const expectedOutput = `Hello John Doe,\n\nWelcome to our platform! We're glad to have you.\n\nBest,\nThe Team`;
    expect(userCreatedEmailTemplate(user)).toEqual(expectedOutput);
  });
});