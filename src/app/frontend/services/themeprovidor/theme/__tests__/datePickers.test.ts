import { render } from '@testing-library/react';
import DatePicker from '../datePickers';

describe('DatePicker Component', () => {
  it('should render without crashing', () => {
    const { container } = render(<DatePicker />);
    expect(container).toBeInTheDocument();
  });

  it('should display the correct initial date', () => {
    const { getByDisplayValue } = render(<DatePicker initialDate='2023-10-01' />);
    expect(getByDisplayValue('2023-10-01')).toBeInTheDocument();
  });

  it('should call onChange when date is changed', () => {
    const handleChange = jest.fn();
    const { getByRole } = render(<DatePicker onChange={handleChange} />);
    const input = getByRole('textbox');
    fireEvent.change(input, { target: { value: '2023-10-02' } });
    expect(handleChange).toHaveBeenCalledWith('2023-10-02');
  });
});