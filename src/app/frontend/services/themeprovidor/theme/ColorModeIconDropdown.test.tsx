import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ColorModeIconDropdown from './ColorModeIconDropdown';

describe('ColorModeIconDropdown', () => {
  test('renders without crashing', () => {
    render(<ColorModeIconDropdown />);
    expect(screen.getByTestId('color-mode-dropdown')).toBeInTheDocument();
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