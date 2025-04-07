import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ForgotPassword from '../forgotPassword';

describe('ForgotPassword Component', () => {
  test('renders the forgot password form', () => {
    render(<ForgotPassword />);
    expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
  });

  test('submits the form with valid email', () => {
    render(<ForgotPassword />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    expect(screen.getByText(/check your email/i)).toBeInTheDocument();
  });

  test('shows error message for invalid email', () => {
    render(<ForgotPassword />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'invalid-email' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
  });
});