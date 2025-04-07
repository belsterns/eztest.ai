import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AuthForm from '../authForm';

describe('AuthForm Component', () => {
  test('renders AuthForm correctly', () => {
    render(<AuthForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  test('submits form with correct data', () => {
    const handleSubmit = jest.fn();
    render(<AuthForm onSubmit={handleSubmit} />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(handleSubmit).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' });
  });
});