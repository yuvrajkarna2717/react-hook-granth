import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import useNetworkSpeed from '../hooks/useNetworkSpeed';

describe('useNetworkSpeed', () => {
  beforeEach(() => {
    // Mock navigator.connection
    Object.defineProperty(navigator, 'connection', {
      writable: true,
      value: {
        effectiveType: '4g',
        downlink: 10,
      },
    });
  });

  it('should return initial network speed', () => {
    const { result } = renderHook(() => useNetworkSpeed());
    expect(result.current).toEqual({
      connectionType: '4g',
      downlink: 10,
    });
  });

  it('should return unknown when connection API is not available', () => {
    Object.defineProperty(navigator, 'connection', {
      writable: true,
      value: undefined,
    });

    const { result } = renderHook(() => useNetworkSpeed());
    expect(result.current).toEqual({
      connectionType: 'unknown',
      downlink: 0,
    });
  });

  it('should add event listeners for online/offline events', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useNetworkSpeed());

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'online',
      expect.any(Function)
    );
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'offline',
      expect.any(Function)
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'online',
      expect.any(Function)
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'offline',
      expect.any(Function)
    );
  });
});
