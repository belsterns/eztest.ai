import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ColorModeSelect from './ColorModeSelect';

describe('ColorModeSelect Component', () => {
  test('renders color mode select', () => {
    render(<ColorModeSelect />);
    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toBeInTheDocument();
  });

  test('changes color mode on select', () => {
    render(<ColorModeSelect />);
    const selectElement = screen.getByRole('combobox');
    fireEvent.change(selectElement, { target: { value: 'dark' } });
    expect(selectElement.value).toBe('dark');
  });
});