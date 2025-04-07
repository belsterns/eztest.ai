import React from 'react';
import { render } from '@testing-library/react';
import Layout from './layout';

describe('Layout Component', () => {
  it('renders without crashing', () => {
    render(<Layout />);
  });

  it('contains the correct elements', () => {
    const { getByText } = render(<Layout />);
    expect(getByText('Expected Text')).toBeInTheDocument();
  });
});