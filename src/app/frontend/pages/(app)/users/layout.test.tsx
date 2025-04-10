import React from 'react';
import { render } from '@testing-library/react';
import Layout from './layout';

describe('Layout Component', () => {
  test('renders without crashing', () => {
    render(<Layout />);
  });

  test('contains user-related elements', () => {
    const { getByText } = render(<Layout />);
    expect(getByText(/users/i)).toBeInTheDocument();
  });
});