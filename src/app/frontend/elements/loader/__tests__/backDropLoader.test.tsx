import React from 'react';
import { render } from '@testing-library/react';
import BackDropLoader from '../backDropLoader';

describe('BackDropLoader Component', () => {
  it('renders without crashing', () => {
    render(<BackDropLoader />);
  });

  it('displays loading message', () => {
    const { getByText } = render(<BackDropLoader />);
    expect(getByText(/loading/i)).toBeInTheDocument();
  });
});