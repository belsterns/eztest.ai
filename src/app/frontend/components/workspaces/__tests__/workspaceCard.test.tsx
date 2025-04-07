import React from 'react';
import { render } from '@testing-library/react';
import WorkspaceCard from '../workspaceCard';

describe('WorkspaceCard Component', () => {
  it('renders without crashing', () => {
    render(<WorkspaceCard />);
  });

  it('displays the correct title', () => {
    const { getByText } = render(<WorkspaceCard title="Test Workspace" />);
    expect(getByText('Test Workspace')).toBeInTheDocument();
  });

  it('calls the onClick handler when clicked', () => {
    const handleClick = jest.fn();
    const { getByRole } = render(<WorkspaceCard onClick={handleClick} />);
    getByRole('button').click();
    expect(handleClick).toHaveBeenCalled();
  });
});