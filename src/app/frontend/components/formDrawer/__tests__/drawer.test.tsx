import React from 'react';
import { render, screen } from '@testing-library/react';
import Drawer from '../drawer';

describe('Drawer Component', () => {
  test('renders without crashing', () => {
    render(<Drawer />);
    const drawerElement = screen.getByTestId('drawer');
    expect(drawerElement).toBeInTheDocument();
  });

  test('displays the correct title', () => {
    const title = 'Test Title';
    render(<Drawer title={title} />);
    expect(screen.getByText(title)).toBeInTheDocument();
  });

  test('calls onClose when close button is clicked', () => {
    const onCloseMock = jest.fn();
    render(<Drawer onClose={onCloseMock} />);
    const closeButton = screen.getByRole('button', { name: /close/i });
    closeButton.click();
    expect(onCloseMock).toHaveBeenCalled();
  });
});