import { render, screen } from '@testing-library/react';
import Layout from './layout';

describe('Layout Component', () => {
  test('renders without crashing', () => {
    render(<Layout />);
    const element = screen.getByTestId('layout');
    expect(element).toBeInTheDocument();
  });

  test('displays the correct title', () => {
    render(<Layout />);
    const title = screen.getByText(/workspace title/i);
    expect(title).toBeInTheDocument();
  });
});