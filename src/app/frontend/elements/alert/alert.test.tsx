import React from 'react';
import { render, screen } from '@testing-library/react';
import Alert from './alert';

describe('Alert Component', () => {
  test('renders alert message', () => {
    render(<Alert message="Test Alert" />);
    const alertMessage = screen.getByText(/Test Alert/i);
    expect(alertMessage).toBeInTheDocument();
  });

  test('renders alert with correct type', () => {
    render(<Alert message="Test Alert" type="success" />);
    const alertElement = screen.getByRole('alert');
    expect(alertElement).toHaveClass('alert-success');
  });
});