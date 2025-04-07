import React from 'react';
import { render } from '@testing-library/react';
import OptionsMenu from '../optionsMenu';

describe('OptionsMenu Component', () => {
  it('renders without crashing', () => {
    render(<OptionsMenu />);
  });

  it('displays the correct options', () => {
    const { getByText } = render(<OptionsMenu />);
    expect(getByText('Option 1')).toBeInTheDocument();
    expect(getByText('Option 2')).toBeInTheDocument();
  });
});