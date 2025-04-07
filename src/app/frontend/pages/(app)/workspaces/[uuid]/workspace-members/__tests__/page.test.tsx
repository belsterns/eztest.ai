import { render, screen } from '@testing-library/react';
import Page from '../page';

describe('Workspace Members Page', () => {
  it('renders without crashing', () => {
    render(<Page />);
    expect(screen.getByText(/workspace members/i)).toBeInTheDocument();
  });

  it('displays the correct title', () => {
    render(<Page />);
    expect(screen.getByRole('heading')).toHaveTextContent('Workspace Members');
  });

  it('renders member list', () => {
    const members = ['Alice', 'Bob', 'Charlie'];
    render(<Page members={members} />);
    members.forEach(member => {
      expect(screen.getByText(member)).toBeInTheDocument();
    });
  });
});