import React from 'react';
import { render } from '@testing-library/react';
import AppTheme from './AppTheme';

describe('AppTheme Component', () => {
  it('renders without crashing', () => {
    render(<AppTheme />);
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<AppTheme />);
    expect(asFragment()).toMatchSnapshot();
  });
});