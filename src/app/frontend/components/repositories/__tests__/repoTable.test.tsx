import React from 'react';
import { render, screen } from '@testing-library/react';
import RepoTable from '../repoTable';

describe('RepoTable Component', () => {
  test('renders without crashing', () => {
    render(<RepoTable />);
    expect(screen.getByText(/repositories/i)).toBeInTheDocument();
  });

  test('displays the correct number of repositories', () => {
    const mockData = [{ id: 1, name: 'Repo 1' }, { id: 2, name: 'Repo 2' }];
    render(<RepoTable repositories={mockData} />);
    expect(screen.getAllByRole('row')).toHaveLength(mockData.length + 1); // +1 for header row
  });

  test('handles empty repository list', () => {
    render(<RepoTable repositories={[]} />);
    expect(screen.getByText(/no repositories found/i)).toBeInTheDocument();
  });
});