import React from 'react';
import { render, screen } from '@testing-library/react';
import WorkspaceTabs from '../workspaceTabs';

describe('WorkspaceTabs Component', () => {
  test('renders without crashing', () => {
    render(<WorkspaceTabs />);
    expect(screen.getByText(/workspace/i)).toBeInTheDocument();
  });

  test('displays the correct number of tabs', () => {
    const tabs = ['Tab 1', 'Tab 2', 'Tab 3'];
    render(<WorkspaceTabs tabs={tabs} />);
    expect(screen.getAllByRole('tab')).toHaveLength(tabs.length);
  });

  test('activates the correct tab on click', () => {
    const tabs = ['Tab 1', 'Tab 2'];
    render(<WorkspaceTabs tabs={tabs} />);
    const tabButton = screen.getByText(/Tab 1/i);
    tabButton.click();
    expect(tabButton).toHaveAttribute('aria-selected', 'true');
  });
});