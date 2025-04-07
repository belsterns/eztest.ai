import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from './header';

describe('Header Component', () => {
  test('renders header with title', () => {
    render(<Header title="Test Title" />);
    const headerElement = screen.getByText(/Test Title/i);
    expect(headerElement).toBeInTheDocument();
  });

  test('renders header with logo', () => {
    render(<Header logo="logo.png" />);
    const logoElement = screen.getByAltText(/logo/i);
    expect(logoElement).toBeInTheDocument();
  });
});