import { renderHook, act } from '@testing-library/react';
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

  // Regression: the hook subscribes to the connection's own `change` event
  // (the real signal) and updates state, and unsubscribes on unmount.
  it('should update on connection change events', () => {
    let changeHandler: (() => void) | undefined;
    const connection = {
      effectiveType: '4g',
      downlink: 10,
      addEventListener: vi.fn((_type: string, cb: () => void) => {
        changeHandler = cb;
      }),
      removeEventListener: vi.fn(),
    };
    // `beforeEach` already defined a writable `connection`; assign to it.
    (navigator as { connection?: unknown }).connection = connection;

    const { result, unmount } = renderHook(() => useNetworkSpeed());
    expect(connection.addEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function)
    );

    act(() => {
      connection.effectiveType = '3g';
      connection.downlink = 1.5;
      changeHandler?.();
    });

    expect(result.current).toEqual({ connectionType: '3g', downlink: 1.5 });

    unmount();
    expect(connection.removeEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function)
    );
  });

  it('should read from a vendor-prefixed connection object', () => {
    // No standard `connection`, but a webkit-prefixed one exists.
    (navigator as { connection?: unknown }).connection = undefined;
    (navigator as { webkitConnection?: unknown }).webkitConnection = {
      effectiveType: '2g',
      downlink: 0.25,
    };

    const { result } = renderHook(() => useNetworkSpeed());
    expect(result.current).toEqual({ connectionType: '2g', downlink: 0.25 });

    delete (navigator as { webkitConnection?: unknown }).webkitConnection;
  });

  it('should not throw when the connection lacks addEventListener', () => {
    // Some environments expose connection data without event support.
    (navigator as { connection?: unknown }).connection = {
      effectiveType: '4g',
      downlink: 8,
    };

    expect(() => {
      const { unmount } = renderHook(() => useNetworkSpeed());
      unmount();
    }).not.toThrow();
  });

  it('should fall back to defaults when connection fields are missing', () => {
    (navigator as { connection?: unknown }).connection = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    const { result } = renderHook(() => useNetworkSpeed());
    expect(result.current).toEqual({
      connectionType: 'unknown',
      downlink: 0,
    });
  });
});
