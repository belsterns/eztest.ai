import React from 'react';
import { render } from '@testing-library/react';
import RepositoriesPage from '../page';

describe('RepositoriesPage', () => {
  it('renders without crashing', () => {
    render(<RepositoriesPage />);
  });
});