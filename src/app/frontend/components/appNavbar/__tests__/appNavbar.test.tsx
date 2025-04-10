import React from 'react';
import { render, screen } from '@testing-library/react';
import AppNavbar from '../appNavbar';

describe('AppNavbar Component', () => {
  test('renders the navbar', () => {
    render(<AppNavbar />);
    const navbarElement = screen.getByRole('navigation');
    expect(navbarElement).toBeInTheDocument();
  });

  test('contains the logo', () => {
    render(<AppNavbar />);
    const logoElement = screen.getByAltText(/logo/i);
    expect(logoElement).toBeInTheDocument();
  });

  test('has a link to home', () => {
    render(<AppNavbar />);
    const homeLink = screen.getByText(/home/i);
    expect(homeLink).toHaveAttribute('href', '/home');
  });
});