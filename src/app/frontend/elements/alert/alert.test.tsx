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
    render(<Alert message="Success" type="success" />);
    const alertType = screen.getByRole('alert');
    expect(alertType).toHaveClass('alert-success');
  });

  test('does not render when message is empty', () => {
    const { container } = render(<Alert message="" />);
    expect(container).toBeEmptyDOMElement();
  });
});