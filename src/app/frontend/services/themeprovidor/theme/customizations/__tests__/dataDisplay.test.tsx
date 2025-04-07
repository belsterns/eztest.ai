import React from 'react';
import { render } from '@testing-library/react';
import DataDisplay from '../dataDisplay';

describe('DataDisplay Component', () => {
  it('renders without crashing', () => {
    render(<DataDisplay />);
  });

  it('displays the correct data', () => {
    const { getByText } = render(<DataDisplay data="Sample Data" />);
    expect(getByText('Sample Data')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<DataDisplay />);
    expect(asFragment()).toMatchSnapshot();
  });
});