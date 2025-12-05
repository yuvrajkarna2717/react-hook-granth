import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import useThrottle from '../hooks/useThrottle';

describe('useThrottle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should call function immediately on first call', () => {
    const mockFn = vi.fn();
    const { result } = renderHook(() => useThrottle(mockFn, 1000));

    act(() => {
      result.current('test');
    });

    expect(mockFn).toHaveBeenCalledWith('test');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should throttle subsequent calls', () => {
    const mockFn = vi.fn();
    const { result } = renderHook(() => useThrottle(mockFn, 1000));

    act(() => {
      result.current('first');
      result.current('second');
      result.current('third');
    });

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('first');
  });

  it('should allow call after delay period', () => {
    const mockFn = vi.fn();
    const { result } = renderHook(() => useThrottle(mockFn, 1000));

    act(() => {
      result.current('first');
    });

    act(() => {
      vi.advanceTimersByTime(1000);
      result.current('second');
    });

    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(mockFn).toHaveBeenNthCalledWith(1, 'first');
    expect(mockFn).toHaveBeenNthCalledWith(2, 'second');
  });
});
