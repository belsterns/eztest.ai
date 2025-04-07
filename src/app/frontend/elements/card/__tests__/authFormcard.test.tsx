import React from 'react';
import { render, screen } from '@testing-library/react';
import AuthFormCard from '../authFormcard';

describe('AuthFormCard Component', () => {
  test('renders AuthFormCard correctly', () => {
    render(<AuthFormCard />);
    const titleElement = screen.getByText(/login/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('submits the form', () => {
    render(<AuthFormCard />);
    const submitButton = screen.getByRole('button', { name: /submit/i });
    expect(submitButton).toBeInTheDocument();
  });
});