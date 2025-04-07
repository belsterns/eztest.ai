import React from 'react';
import { render, screen } from '@testing-library/react';
import SideMenu from '../sideMenu';

describe('SideMenu Component', () => {
  test('renders correctly', () => {
    render(<SideMenu />);
    const menuElement = screen.getByRole('navigation');
    expect(menuElement).toBeInTheDocument();
  });

  test('contains expected menu items', () => {
    render(<SideMenu />);
    const item1 = screen.getByText(/Home/i);
    const item2 = screen.getByText(/About/i);
    expect(item1).toBeInTheDocument();
    expect(item2).toBeInTheDocument();
  });
});