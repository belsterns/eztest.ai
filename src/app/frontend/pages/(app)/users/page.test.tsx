import React from 'react';
import { render, screen } from '@testing-library/react';
import UsersPage from './page';

test('renders Users page', () => {
  render(<UsersPage />);
  const linkElement = screen.getByText(/users/i);
  expect(linkElement).toBeInTheDocument();
});