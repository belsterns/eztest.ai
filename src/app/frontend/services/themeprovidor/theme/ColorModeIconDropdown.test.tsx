import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ColorModeIconDropdown from './ColorModeIconDropdown';

describe('ColorModeIconDropdown', () => {
  test('renders correctly', () => {
    render(<ColorModeIconDropdown />);
    expect(screen.getByText(/color mode/i)).toBeInTheDocument();
  });

  test('toggles color mode on click', () => {
    render(<ColorModeIconDropdown />);
    const toggleButton = screen.getByRole('button');
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveAttribute('aria-pressed', 'false');
  });
});