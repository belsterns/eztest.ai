import React from 'react';
import { render } from '@testing-library/react';
import Repositories from './repositories';

describe('Repositories Component', () => {
  it('renders without crashing', () => {
    render(<Repositories />);
  });

  it('displays the correct title', () => {
    const { getByText } = render(<Repositories />);
    expect(getByText('Repositories')).toBeInTheDocument();
  });
});