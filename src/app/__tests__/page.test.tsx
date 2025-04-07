import { render, screen } from '@testing-library/react';
import Page from '../page';

describe('Page Component', () => {
  test('renders correctly', () => {
    render(<Page />);
    const element = screen.getByText(/some text/i);
    expect(element).toBeInTheDocument();
  });
});