import React from 'react';
import { render, screen } from '@testing-library/react';
import AllWorkspaces from '../allWorkspaces';

describe('AllWorkspaces Component', () => {
  test('renders without crashing', () => {
    render(<AllWorkspaces />);
    const element = screen.getByText(/workspaces/i);
    expect(element).toBeInTheDocument();
  });

  test('displays the correct number of workspaces', () => {
    const workspaces = [{ id: 1, name: 'Workspace 1' }, { id: 2, name: 'Workspace 2' }];
    render(<AllWorkspaces workspaces={workspaces} />);
    const workspaceElements = screen.getAllByRole('listitem');
    expect(workspaceElements.length).toBe(workspaces.length);
  });
});