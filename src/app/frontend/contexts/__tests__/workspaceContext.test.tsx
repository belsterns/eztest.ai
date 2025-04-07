import React from 'react';
import { render, screen } from '@testing-library/react';
import { WorkspaceProvider } from '../workspaceContext';

describe('WorkspaceContext', () => {
  test('renders children correctly', () => {
    render(
      <WorkspaceProvider>
        <div>Test Child</div>
      </WorkspaceProvider>
    );
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });
});