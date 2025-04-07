import { render, screen, fireEvent } from '@testing-library/react';
import RegisterPage from '../page';

describe('RegisterPage', () => {
  test('renders register form', () => {
    render(<RegisterPage />);
    const heading = screen.getByText(/register/i);
    expect(heading).toBeInTheDocument();
  });

  test('submits form with valid data', () => {
    render(<RegisterPage />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    // Add assertions for successful submission
  });

  test('shows error message with invalid data', () => {
    render(<RegisterPage />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'invalid-email' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    const errorMessage = screen.getByText(/invalid email/i);
    expect(errorMessage).toBeInTheDocument();
  });
});