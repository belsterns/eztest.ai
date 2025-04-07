import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ColorModeSelect from './ColorModeSelect';

describe('ColorModeSelect Component', () => {
  test('renders ColorModeSelect', () => {
    render(<ColorModeSelect />);
    expect(screen.getByText(/light/i)).toBeInTheDocument();
    expect(screen.getByText(/dark/i)).toBeInTheDocument();
  });

  test('changes color mode on selection', () => {
    render(<ColorModeSelect />);
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'dark' } });
    expect(select.value).toBe('dark');
  });
});