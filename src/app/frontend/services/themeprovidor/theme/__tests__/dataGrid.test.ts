import { DataGrid } from '../dataGrid';

describe('DataGrid', () => {
  it('should render correctly', () => {
    const grid = new DataGrid();
    expect(grid).toBeDefined();
  });

  it('should apply customizations', () => {
    const grid = new DataGrid();
    grid.customize({ color: 'red' });
    expect(grid.getStyle().color).toBe('red');
  });
});