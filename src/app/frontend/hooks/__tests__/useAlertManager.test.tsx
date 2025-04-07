import { renderHook } from '@testing-library/react-hooks';
import { useAlertManager } from '../useAlertManager';

describe('useAlertManager', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useAlertManager());
    expect(result.current.alerts).toEqual([]);
    expect(result.current.addAlert).toBeInstanceOf(Function);
    expect(result.current.removeAlert).toBeInstanceOf(Function);
  });

  it('should add an alert', () => {
    const { result } = renderHook(() => useAlertManager());
    result.current.addAlert({ message: 'Test alert', type: 'info' });
    expect(result.current.alerts).toHaveLength(1);
    expect(result.current.alerts[0]).toEqual({ message: 'Test alert', type: 'info' });
  });

  it('should remove an alert', () => {
    const { result } = renderHook(() => useAlertManager());
    result.current.addAlert({ message: 'Test alert', type: 'info' });
    result.current.removeAlert(0);
    expect(result.current.alerts).toHaveLength(0);
  });
});