import React from 'react';
import { render } from '@testing-library/react';
import AllWorkspaces from '../allWorkspaces';

describe('AllWorkspaces Component', () => {
  it('renders without crashing', () => {
    render(<AllWorkspaces />);
  });

  it('displays the correct title', () => {
    const { getByText } = render(<AllWorkspaces />);
    expect(getByText(/Workspaces/i)).toBeInTheDocument();
  });

  // Add more tests based on the component's functionality
});