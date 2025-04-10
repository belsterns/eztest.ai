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

  it('handles click events correctly', () => {
    const { getByTestId } = render(<MenuContent />);
    const menuItem = getByTestId('menu-item');
    fireEvent.click(menuItem);
    expect(menuItem).toHaveClass('active');
  });
});