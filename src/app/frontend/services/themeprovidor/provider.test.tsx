import React from 'react';
import { render } from '@testing-library/react';
import ThemeProvider from './provider';

describe('ThemeProvider', () => {
  it('renders without crashing', () => {
    render(<ThemeProvider>Test</ThemeProvider>);
  });

  it('applies the correct theme', () => {
    const { getByTestId } = render(<ThemeProvider theme='dark'>Test</ThemeProvider>);
    expect(getByTestId('theme-provider')).toHaveClass('dark');
  });
});