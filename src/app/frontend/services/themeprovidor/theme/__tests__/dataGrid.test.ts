import { render } from '@testing-library/react';
import DataGrid from '../dataGrid';

describe('DataGrid Component', () => {
  it('renders without crashing', () => {
    render(<DataGrid />);
  });

  it('displays the correct data', () => {
    const { getByText } = render(<DataGrid data={[{ id: 1, name: 'Test Item' }]} />);
    expect(getByText('Test Item')).toBeInTheDocument();
  });
});