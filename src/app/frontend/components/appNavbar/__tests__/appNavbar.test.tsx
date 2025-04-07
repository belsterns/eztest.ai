import React from 'react';
import { render, screen } from '@testing-library/react';
import AppNavbar from '../appNavbar';

describe('AppNavbar', () => {
  test('renders the navbar', () => {
    render(<AppNavbar />);
    const navbarElement = screen.getByRole('navigation');
    expect(navbarElement).toBeInTheDocument();
  });

  test('contains the correct links', () => {
    render(<AppNavbar />);
    const linkElement = screen.getByText(/home/i);
    expect(linkElement).toBeInTheDocument();
  });
});