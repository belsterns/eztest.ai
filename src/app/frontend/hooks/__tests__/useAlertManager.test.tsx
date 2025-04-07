import { renderHook, act } from '@testing-library/react-hooks';
import { useAlertManager } from '../useAlertManager';

describe('useAlertManager', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useAlertManager());
    expect(result.current.alerts).toEqual([]);
    expect(result.current.addAlert).toBeInstanceOf(Function);
  });

  it('should add an alert', () => {
    const { result } = renderHook(() => useAlertManager());
    act(() => {
      result.current.addAlert({ message: 'Test Alert', type: 'info' });
    });
    expect(result.current.alerts).toHaveLength(1);
    expect(result.current.alerts[0]).toEqual({ message: 'Test Alert', type: 'info' });
  });

  it('should remove an alert', () => {
    const { result } = renderHook(() => useAlertManager());
    act(() => {
      result.current.addAlert({ message: 'Test Alert', type: 'info' });
    });
    act(() => {
      result.current.removeAlert(0);
    });
    expect(result.current.alerts).toHaveLength(0);
  });
});