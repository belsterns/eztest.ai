import React from 'react';
import { render } from '@testing-library/react';
import SideMenuMobile from '../sideMenuMobile';

describe('SideMenuMobile Component', () => {
  it('renders without crashing', () => {
    render(<SideMenuMobile />);
  });

  it('displays the correct menu items', () => {
    const { getByText } = render(<SideMenuMobile />);
    expect(getByText('Home')).toBeInTheDocument();
    expect(getByText('About')).toBeInTheDocument();
    expect(getByText('Contact')).toBeInTheDocument();
  });

  it('toggles menu visibility on button click', () => {
    const { getByRole, queryByText } = render(<SideMenuMobile />);
    const toggleButton = getByRole('button');
    toggleButton.click();
    expect(getByText('Home')).toBeVisible();
    toggleButton.click();
    expect(queryByText('Home')).not.toBeVisible();
  });
});