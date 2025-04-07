import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Form from './form';

describe('Form Component', () => {
  test('renders form correctly', () => {
    render(<Form />);
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  test('submits form with correct data', () => {
    const handleSubmit = jest.fn();
    render(<Form onSubmit={handleSubmit} />);

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(handleSubmit).toHaveBeenCalledWith({ name: 'John Doe', email: 'john@example.com' });
  });
});