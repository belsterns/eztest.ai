import React from 'react';
import { render, screen } from '@testing-library/react';
import WorkspaceTabs from '../workspaceTabs';

describe('WorkspaceTabs Component', () => {
  test('renders without crashing', () => {
    render(<WorkspaceTabs />);
    const element = screen.getByTestId('workspace-tabs');
    expect(element).toBeInTheDocument();
  });

  test('displays the correct number of tabs', () => {
    const tabs = ['Tab1', 'Tab2', 'Tab3'];
    render(<WorkspaceTabs tabs={tabs} />);
    const tabElements = screen.getAllByRole('tab');
    expect(tabElements.length).toBe(tabs.length);
  });

  test('activates the correct tab on click', () => {
    const tabs = ['Tab1', 'Tab2', 'Tab3'];
    render(<WorkspaceTabs tabs={tabs} />);
    const tab1 = screen.getByText('Tab1');
    tab1.click();
    expect(tab1).toHaveAttribute('aria-selected', 'true');
  });
});