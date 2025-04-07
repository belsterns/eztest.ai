import { renderHook } from '@testing-library/react-hooks';
import useAPICall from '../useAPICall';

describe('useAPICall', () => {
  it('should return initial state', () => {
    const { result } = renderHook(() => useAPICall());
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(null);
    expect(result.current.loading).toBe(false);
  });

  it('should fetch data successfully', async () => {
    const mockData = { id: 1, name: 'Test' };
    global.fetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve(mockData) }));
    const { result, waitForNextUpdate } = renderHook(() => useAPICall('https://api.example.com/data'));

    expect(result.current.loading).toBe(true);
    await waitForNextUpdate();

    expect(result.current.data).toEqual(mockData);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should handle fetch error', async () => {
    global.fetch = jest.fn(() => Promise.reject('API is down'));
    const { result, waitForNextUpdate } = renderHook(() => useAPICall('https://api.example.com/data'));

    expect(result.current.loading).toBe(true);
    await waitForNextUpdate();

    expect(result.current.data).toBe(null);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('API is down');
  });
});