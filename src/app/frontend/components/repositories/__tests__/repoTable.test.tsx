import React from 'react';
import { render, screen } from '@testing-library/react';
import RepoTable from '../repoTable';

describe('RepoTable Component', () => {
  test('renders without crashing', () => {
    render(<RepoTable />);
    const tableElement = screen.getByRole('table');
    expect(tableElement).toBeInTheDocument();
  });

  test('displays the correct number of repositories', () => {
    const mockData = [{ id: 1, name: 'Repo1' }, { id: 2, name: 'Repo2' }];
    render(<RepoTable repositories={mockData} />);
    const rows = screen.getAllByRole('row');
    expect(rows.length).toBe(mockData.length + 1); // +1 for header row
  });

  test('renders repository names correctly', () => {
    const mockData = [{ id: 1, name: 'Repo1' }, { id: 2, name: 'Repo2' }];
    render(<RepoTable repositories={mockData} />);
    expect(screen.getByText('Repo1')).toBeInTheDocument();
    expect(screen.getByText('Repo2')).toBeInTheDocument();
  });
});