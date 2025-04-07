import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import DeleteConfirmation from '../deleteConfirmation';

describe('DeleteConfirmation Component', () => {
  it('renders correctly', () => {
    const { getByText } = render(<DeleteConfirmation />);
    expect(getByText('Are you sure you want to delete this item?')).toBeInTheDocument();
  });

  it('calls the onDelete function when confirmed', () => {
    const onDeleteMock = jest.fn();
    const { getByText } = render(<DeleteConfirmation onDelete={onDeleteMock} />);
    fireEvent.click(getByText('Delete')); 
    expect(onDeleteMock).toHaveBeenCalled();
  });

  it('closes the popup when cancelled', () => {
    const { getByText } = render(<DeleteConfirmation />);
    fireEvent.click(getByText('Cancel'));
    expect(getByText('Are you sure you want to delete this item?')).not.toBeInTheDocument();
  });
});