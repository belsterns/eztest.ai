import React from 'react';
import { render, screen } from '@testing-library/react';
import Drawer from '../drawer';

describe('Drawer Component', () => {
  test('renders correctly', () => {
    render(<Drawer />);
    const drawerElement = screen.getByTestId('drawer');
    expect(drawerElement).toBeInTheDocument();
  });

  test('displays the correct title', () => {
    const title = 'Test Drawer';
    render(<Drawer title={title} />);
    expect(screen.getByText(title)).toBeInTheDocument();
  });

  test('handles open and close actions', () => {
    const { getByText } = render(<Drawer />);
    const openButton = getByText('Open');
    openButton.click();
    expect(screen.getByTestId('drawer')).toHaveClass('open');
    const closeButton = getByText('Close');
    closeButton.click();
    expect(screen.getByTestId('drawer')).not.toHaveClass('open');
  });
});