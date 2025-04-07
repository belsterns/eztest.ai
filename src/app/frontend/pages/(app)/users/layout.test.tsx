import React from 'react';
import { render } from '@testing-library/react';
import Layout from './layout';

describe('Layout Component', () => {
  it('renders without crashing', () => {
    render(<Layout />);
  });

  it('contains user information', () => {
    const { getByText } = render(<Layout />);
    expect(getByText(/user information/i)).toBeInTheDocument();
  });
});