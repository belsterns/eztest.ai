import { render, screen } from '@testing-library/react';
import UsersPage from '../page';

describe('UsersPage', () => {
  it('renders correctly', () => {
    render(<UsersPage />);
    expect(screen.getByText(/Users/i)).toBeInTheDocument();
  });
});