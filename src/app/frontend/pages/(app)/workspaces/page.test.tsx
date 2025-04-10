import { render, screen } from '@testing-library/react';
import WorkspacesPage from './page';

describe('WorkspacesPage', () => {
  it('renders without crashing', () => {
    render(<WorkspacesPage />);
    expect(screen.getByText(/workspaces/i)).toBeInTheDocument();
  });
});