import React from 'react';
import { render } from '@testing-library/react';
import MenuContent from '../menuContent';

describe('MenuContent Component', () => {
  it('renders without crashing', () => {
    render(<MenuContent />);
  });

  it('displays the correct menu items', () => {
    const { getByText } = render(<MenuContent />);
    expect(getByText('Expected Menu Item')).toBeInTheDocument();
  });
});