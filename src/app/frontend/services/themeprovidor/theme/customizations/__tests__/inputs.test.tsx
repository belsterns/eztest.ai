import React from 'react';
import { render } from '@testing-library/react';
import Inputs from '../inputs';

describe('Inputs Component', () => {
  it('renders without crashing', () => {
    render(<Inputs />);
  });

  it('should have the correct initial state', () => {
    const { getByTestId } = render(<Inputs />);
    expect(getByTestId('input-element')).toHaveValue('');
  });

  it('should update state on input change', () => {
    const { getByTestId } = render(<Inputs />);
    const input = getByTestId('input-element');
    fireEvent.change(input, { target: { value: 'new value' } });
    expect(input).toHaveValue('new value');
  });
});