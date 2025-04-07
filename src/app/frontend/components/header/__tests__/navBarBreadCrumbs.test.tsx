import React from 'react';
import { render } from '@testing-library/react';
import NavBarBreadCrumbs from '../navBarBreadCrumbs';

describe('NavBarBreadCrumbs Component', () => {
  it('renders without crashing', () => {
    render(<NavBarBreadCrumbs />);
  });

  it('displays the correct breadcrumb items', () => {
    const { getByText } = render(<NavBarBreadCrumbs items={[{ label: 'Home', path: '/' }, { label: 'About', path: '/about' }]} />);
    expect(getByText('Home')).toBeInTheDocument();
    expect(getByText('About')).toBeInTheDocument();
  });
});