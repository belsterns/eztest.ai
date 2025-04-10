import React from 'react';
import { render, screen } from '@testing-library/react';
import Content from './content';

describe('Content Component', () => {
  test('renders correctly', () => {
    render(<Content />);
    const element = screen.getByText(/some text/i);
    expect(element).toBeInTheDocument();
  });
});