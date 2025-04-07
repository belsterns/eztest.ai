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

  test('useAlert provides alert functionality', () => {
    const TestComponent = () => {
      const { showAlert } = useAlert();
      React.useEffect(() => {
        showAlert('Test Alert');
      }, [showAlert]);
      return <div>Test Component</div>;
    };

    render(
      <AlertProvider>
        <TestComponent />
      </AlertProvider>
    );
    expect(screen.getByText('Test Component')).toBeInTheDocument();
    // Additional assertions for alert functionality can be added here
  });
});