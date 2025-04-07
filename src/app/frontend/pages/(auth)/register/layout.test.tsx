import React from 'react';
import { render } from '@testing-library/react';
import Layout from './layout';

describe('Layout Component', () => {
  it('renders without crashing', () => {
    render(<Layout />);
  });

  it('contains the registration form', () => {
    const { getByText } = render(<Layout />);
    expect(getByText(/register/i)).toBeInTheDocument();
  });
});