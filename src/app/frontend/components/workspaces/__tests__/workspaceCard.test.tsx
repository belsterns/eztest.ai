import React from 'react';
import { render, screen } from '@testing-library/react';
import WorkspaceCard from '../workspaceCard';

describe('WorkspaceCard Component', () => {
  it('renders correctly', () => {
    render(<WorkspaceCard />);
    expect(screen.getByText(/workspace/i)).toBeInTheDocument();
  });

  it('displays the correct title', () => {
    const title = 'My Workspace';
    render(<WorkspaceCard title={title} />);
    expect(screen.getByText(title)).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<WorkspaceCard onClick={handleClick} />);
    const card = screen.getByRole('button');
    card.click();
    expect(handleClick).toHaveBeenCalled();
  });
});