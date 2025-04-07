import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import DeleteConfirmation from '../deleteConfirmation';

describe('DeleteConfirmation Component', () => {
  it('renders correctly', () => {
    const { getByText } = render(<DeleteConfirmation />);
    expect(getByText(/are you sure you want to delete/i)).toBeInTheDocument();
  });

  it('calls the delete function when confirmed', () => {
    const mockDelete = jest.fn();
    const { getByText } = render(<DeleteConfirmation onDelete={mockDelete} />);
    fireEvent.click(getByText(/confirm/i));
    expect(mockDelete).toHaveBeenCalled();
  });

  it('does not call the delete function when cancelled', () => {
    const mockDelete = jest.fn();
    const { getByText } = render(<DeleteConfirmation onDelete={mockDelete} />);
    fireEvent.click(getByText(/cancel/i));
    expect(mockDelete).not.toHaveBeenCalled();
  });
});