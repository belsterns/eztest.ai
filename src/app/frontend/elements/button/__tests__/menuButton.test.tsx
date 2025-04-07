import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MenuButton from '../menuButton';

describe('MenuButton Component', () => {
  test('renders button with correct label', () => {
    render(<MenuButton label='Menu' />);
    const buttonElement = screen.getByRole('button', { name: /menu/i });
    expect(buttonElement).toBeInTheDocument();
  });

  test('calls onClick function when clicked', () => {
    const handleClick = jest.fn();
    render(<MenuButton label='Menu' onClick={handleClick} />);
    const buttonElement = screen.getByRole('button', { name: /menu/i });
    fireEvent.click(buttonElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});