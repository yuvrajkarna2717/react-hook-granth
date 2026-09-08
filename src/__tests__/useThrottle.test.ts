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

  // Regression: the final call in a burst must not be dropped. The leading
  // call fires immediately, and a trailing call fires at the end of the window
  // with the most recent arguments.
  it('should fire a trailing call with the latest args after the window', () => {
    const mockFn = vi.fn();
    const { result } = renderHook(() => useThrottle(mockFn, 1000));

    act(() => {
      result.current('first'); // leading, fires immediately
      result.current('second'); // throttled, schedules trailing
      result.current('third'); // throttled, updates trailing args
    });

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenNthCalledWith(1, 'first');

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Trailing edge delivers the most recent arguments.
    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(mockFn).toHaveBeenNthCalledWith(2, 'third');
  });

  it('should use the latest callback without re-subscribing', () => {
    const first = vi.fn();
    const second = vi.fn();
    const { result, rerender } = renderHook(({ cb }) => useThrottle(cb, 1000), {
      initialProps: { cb: first },
    });

    rerender({ cb: second });

    act(() => {
      result.current('x');
    });

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledWith('x');
  });

  it('should clear the pending trailing timer on unmount', () => {
    const mockFn = vi.fn();
    const { result, unmount } = renderHook(() => useThrottle(mockFn, 1000));

    act(() => {
      result.current('first'); // leading
      result.current('second'); // schedules trailing
    });

    unmount();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Only the leading call ran; the trailing timer was cleared on unmount.
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should clear the pending trailing timer when a later call fires immediately', () => {
    const mockFn = vi.fn();
    const { result } = renderHook(() => useThrottle(mockFn, 1000));

    act(() => {
      result.current('a'); // leading, fires immediately (t=0)
      result.current('b'); // within window -> schedules trailing
    });
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenNthCalledWith(1, 'a');

    // Move past the window WITHOUT letting the trailing fire on its own, then
    // call again: remaining <= 0 takes the immediate branch and clears the
    // still-pending trailing timer.
    act(() => {
      vi.advanceTimersByTime(1000); // trailing fires here with 'b'
    });
    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(mockFn).toHaveBeenNthCalledWith(2, 'b');

    // A fresh burst after the window: immediate 'c', schedule trailing, latest
    // args 'd' delivered on the trailing edge.
    act(() => {
      vi.advanceTimersByTime(1000);
      result.current('c'); // remaining <= 0 -> immediate
    });
    expect(mockFn).toHaveBeenNthCalledWith(3, 'c');

    act(() => {
      result.current('d'); // schedules trailing
      vi.advanceTimersByTime(1000);
    });
    expect(mockFn).toHaveBeenNthCalledWith(4, 'd');
  });
});
