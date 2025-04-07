import React from 'react';
import { render, screen } from '@testing-library/react';
import { AlertProvider, useAlert } from '../alertContext';

describe('AlertContext', () => {
  test('renders children within AlertProvider', () => {
    render(
      <AlertProvider>
        <div>Test Child</div>
      </AlertProvider>
    );
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  test('useAlert provides alert functions', () => {
    const TestComponent = () => {
      const { showAlert } = useAlert();
      React.useEffect(() => {
        showAlert('Test Alert');
      }, [showAlert]);
      return null;
    };

    render(
      <AlertProvider>
        <TestComponent />
      </AlertProvider>
    );
    // Add assertions to check if the alert was shown (depends on implementation)
  });
});