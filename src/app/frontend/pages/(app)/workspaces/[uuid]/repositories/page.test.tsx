import React from 'react';
import { render } from '@testing-library/react';
import Page from './page';

describe('Page Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<Page />);
    expect(container).toBeInTheDocument();
  });

  it('displays the correct title', () => {
    const { getByText } = render(<Page />);
    expect(getByText('Expected Title')).toBeInTheDocument();
  });
});