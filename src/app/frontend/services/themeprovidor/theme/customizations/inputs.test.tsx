import React from 'react';
import { render } from '@testing-library/react';
import Inputs from './inputs';

describe('Inputs Component', () => {
  it('renders without crashing', () => {
    render(<Inputs />);
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<Inputs />);
    expect(asFragment()).toMatchSnapshot();
  });
});