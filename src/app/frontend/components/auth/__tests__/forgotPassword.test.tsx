import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ForgotPassword from '../forgotPassword';

describe('ForgotPassword Component', () => {
  test('renders forgot password form', () => {
    render(<ForgotPassword />);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });
    expect(emailInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  test('submits form with valid email', () => {
    render(<ForgotPassword />);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);
    // Add assertions for successful submission
  });

  test('shows error message with invalid email', () => {
    render(<ForgotPassword />);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);
    const errorMessage = screen.getByText(/invalid email/i);
    expect(errorMessage).toBeInTheDocument();
  });
});