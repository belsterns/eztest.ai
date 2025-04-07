import React from 'react';
import { render, screen } from '@testing-library/react';
import Form from './form';

describe('Form Component', () => {
  test('renders form correctly', () => {
    render(<Form />);
    const formElement = screen.getByRole('form');
    expect(formElement).toBeInTheDocument();
  });

  test('submits form with correct data', () => {
    const handleSubmit = jest.fn();
    render(<Form onSubmit={handleSubmit} />);
    // Simulate form filling and submission
    // Add your form filling logic here
    expect(handleSubmit).toHaveBeenCalledWith(expectedData);
  });
});