import React from 'react';
import { render } from '@testing-library/react';
import Loader from './loader';

describe('Loader Component', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(<Loader />);
    expect(getByTestId('loader')).toBeInTheDocument();
  });

  it('displays loading text', () => {
    const { getByText } = render(<Loader />);
    expect(getByText('Loading...')).toBeInTheDocument();
  });
});