import React from 'react';
import { render } from '@testing-library/react';
import Page from './page';

describe('Page Component', () => {
  it('renders without crashing', () => {
    const { getByText } = render(<Page />);
    expect(getByText(/some text/i)).toBeInTheDocument();
  });
});