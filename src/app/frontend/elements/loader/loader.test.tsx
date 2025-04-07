import React from 'react';
import { render } from '@testing-library/react';
import Loader from './loader';

describe('Loader Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<Loader />);
    expect(container).toBeInTheDocument();
  });

  it('displays loading text', () => {
    const { getByText } = render(<Loader />);
    expect(getByText(/loading/i)).toBeInTheDocument();
  });
});