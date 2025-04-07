import { render, screen } from '@testing-library/react';
import Page from '../page';

describe('Workspace Members Page', () => {
  it('renders correctly', () => {
    render(<Page />);
    expect(screen.getByText(/workspace members/i)).toBeInTheDocument();
  });
});