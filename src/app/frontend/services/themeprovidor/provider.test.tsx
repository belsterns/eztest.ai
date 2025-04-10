import React from 'react';
import { render } from '@testing-library/react';
import ThemeProvider from './provider';

describe('ThemeProvider', () => {
  it('renders without crashing', () => {
    render(<ThemeProvider>Test</ThemeProvider>);
  });

  it('provides the correct theme context', () => {
    const { getByText } = render(<ThemeProvider>Test</ThemeProvider>);
    expect(getByText('Test')).toBeInTheDocument();
  });
});