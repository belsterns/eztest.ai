import React from 'react';
import { render, screen } from '@testing-library/react';
import SideMenu from '../sideMenu';

describe('SideMenu Component', () => {
  test('renders correctly', () => {
    render(<SideMenu />);
    const sideMenuElement = screen.getByRole('navigation');
    expect(sideMenuElement).toBeInTheDocument();
  });

  test('contains expected menu items', () => {
    render(<SideMenu />);
    const menuItem = screen.getByText(/expected menu item/i);
    expect(menuItem).toBeInTheDocument();
  });
});