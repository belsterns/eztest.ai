import React from 'react';
import { render } from '@testing-library/react';
import WorkspacesPage from './page';

describe('WorkspacesPage', () => {
  it('renders without crashing', () => {
    render(<WorkspacesPage />);
  });

  it('displays the correct title', () => {
    const { getByText } = render(<WorkspacesPage />);
    expect(getByText('Workspaces')).toBeInTheDocument();
  });
});