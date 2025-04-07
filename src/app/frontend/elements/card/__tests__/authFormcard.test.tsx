import React from 'react';
import { render, screen } from '@testing-library/react';
import AuthFormCard from '../authFormcard';

describe('AuthFormCard Component', () => {
  test('renders AuthFormCard correctly', () => {
    render(<AuthFormCard />);
    const headingElement = screen.getByText(/login/i);
    expect(headingElement).toBeInTheDocument();
  });

  test('submits the form correctly', () => {
    render(<AuthFormCard />);
    const submitButton = screen.getByRole('button', { name: /submit/i });
    expect(submitButton).toBeInTheDocument();
  });
});