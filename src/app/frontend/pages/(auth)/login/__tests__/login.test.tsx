import { render, screen } from '@testing-library/react';
import Login from '../page';

describe('Login Page', () => {
  test('renders login form', () => {
    render(<Login />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });
});