import React from 'react';
import { render } from '@testing-library/react';
import Layout from './layout';

describe('Layout Component', () => {
  it('renders without crashing', () => {
    render(<Layout />);
  });

  it('contains login form', () => {
    const { getByTestId } = render(<Layout />);
    expect(getByTestId('login-form')).toBeInTheDocument();
  });
});