import React from 'react';
import { render } from '@testing-library/react';
import CustomIcons from './CustomIcons';

describe('CustomIcons Component', () => {
  it('renders without crashing', () => {
    render(<CustomIcons />);
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<CustomIcons />);
    expect(asFragment()).toMatchSnapshot();
  });
});