import { render } from '@testing-library/react';
import Layout from './layout';

describe('Layout Component', () => {
  it('renders without crashing', () => {
    render(<Layout />);
  });
});