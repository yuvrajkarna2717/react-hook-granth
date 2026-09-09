import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import useGeolocation from '../hooks/useGeolocation';

const makePosition = (lat: number, lng: number) => ({
  coords: {
    latitude: lat,
    longitude: lng,
    accuracy: 10,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    speed: null,
  },
  timestamp: 1234,
});

afterEach(() => {
  // Remove mock.
  delete (navigator as { geolocation?: unknown }).geolocation;
  vi.restoreAllMocks();
});

describe('useGeolocation', () => {
  it('errors when geolocation is unsupported', async () => {
    delete (navigator as { geolocation?: unknown }).geolocation;
    const { result } = renderHook(() => useGeolocation());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.coords).toBeNull();
  });

  it('reports coords on a successful fix', async () => {
    let successCb: (p: unknown) => void = () => {};
    (navigator as { geolocation?: unknown }).geolocation = {
      watchPosition: vi.fn((onSuccess: (p: unknown) => void) => {
        successCb = onSuccess;
        return 1;
      }),
      clearWatch: vi.fn(),
    };

    const { result } = renderHook(() => useGeolocation());
    act(() => successCb(makePosition(12, 34)));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.coords).toMatchObject({
      latitude: 12,
      longitude: 34,
    });
    expect(result.current.timestamp).toBe(1234);
  });

  it('reports errors from the watcher', async () => {
    let errorCb: (e: unknown) => void = () => {};
    (navigator as { geolocation?: unknown }).geolocation = {
      watchPosition: vi.fn((_s: unknown, onError: (e: unknown) => void) => {
        errorCb = onError;
        return 1;
      }),
      clearWatch: vi.fn(),
    };

    const { result } = renderHook(() => useGeolocation());
    act(() => errorCb({ code: 1, message: 'denied' }));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toMatchObject({ message: 'denied' });
  });

  it('clears the watch on unmount', () => {
    const clearWatch = vi.fn();
    (navigator as { geolocation?: unknown }).geolocation = {
      watchPosition: vi.fn(() => 42),
      clearWatch,
    };

    const { unmount } = renderHook(() => useGeolocation());
    unmount();
    expect(clearWatch).toHaveBeenCalledWith(42);
  });
});
