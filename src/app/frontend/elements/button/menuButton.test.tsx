import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MenuButton from './menuButton';

describe('MenuButton Component', () => {
  test('renders the button with correct text', () => {
    render(<MenuButton text="Menu" />);
    const buttonElement = screen.getByText(/menu/i);
    expect(buttonElement).toBeInTheDocument();
  });

  test('calls the onClick function when clicked', () => {
    const handleClick = jest.fn();
    render(<MenuButton text="Menu" onClick={handleClick} />);
    const buttonElement = screen.getByText(/menu/i);
    fireEvent.click(buttonElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});