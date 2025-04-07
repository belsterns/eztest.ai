import React from 'react';
import { render } from '@testing-library/react';
import DataDisplay from '../dataDisplay';

describe('DataDisplay Component', () => {
  it('renders correctly', () => {
    const { getByText } = render(<DataDisplay />);
    expect(getByText(/some text/i)).toBeInTheDocument();
  });

  it('displays data passed as props', () => {
    const data = 'Test Data';
    const { getByText } = render(<DataDisplay data={data} />);
    expect(getByText(data)).toBeInTheDocument();
  });
});