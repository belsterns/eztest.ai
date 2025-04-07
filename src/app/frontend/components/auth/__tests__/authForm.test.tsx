import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AuthForm from '../authForm';

describe('AuthForm Component', () => {
  test('renders the form', () => {
    render(<AuthForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  test('submits the form with valid data', () => {
    render(<AuthForm />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    // Add assertions to check if the form submission is handled correctly
  });

  test('shows error message with invalid data', () => {
    render(<AuthForm />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'invalid-email' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
  });
});