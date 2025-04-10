import React from 'react';
import { render } from '@testing-library/react';
import BackDropLoader from './backDropLoader';

describe('BackDropLoader Component', () => {
  it('renders without crashing', () => {
    render(<BackDropLoader />);
  });

  it('displays loading message when loading prop is true', () => {
    const { getByText } = render(<BackDropLoader loading={true} />);
    expect(getByText(/loading/i)).toBeInTheDocument();
  });

  it('does not display loading message when loading prop is false', () => {
    const { queryByText } = render(<BackDropLoader loading={false} />);
    expect(queryByText(/loading/i)).not.toBeInTheDocument();
  });
});