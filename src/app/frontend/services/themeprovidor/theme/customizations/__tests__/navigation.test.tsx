import React from 'react';
import { render } from '@testing-library/react';
import Navigation from '../navigation';

describe('Navigation Component', () => {
  it('renders without crashing', () => {
    render(<Navigation />);
  });

  it('contains expected elements', () => {
    const { getByText } = render(<Navigation />);
    expect(getByText('Home')).toBeInTheDocument();
    expect(getByText('About')).toBeInTheDocument();
  });
});