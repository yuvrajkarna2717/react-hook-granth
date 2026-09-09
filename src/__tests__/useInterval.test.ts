import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import useInterval from '../hooks/useInterval';

describe('useInterval', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('calls the callback on each interval', () => {
    const cb = vi.fn();
    renderHook(() => useInterval(cb, 1000));

    act(() => vi.advanceTimersByTime(1000));
    expect(cb).toHaveBeenCalledTimes(1);

    act(() => vi.advanceTimersByTime(2000));
    expect(cb).toHaveBeenCalledTimes(3);
  });

  it('pauses when delay is null', () => {
    const cb = vi.fn();
    renderHook(() => useInterval(cb, null));

    act(() => vi.advanceTimersByTime(5000));
    expect(cb).not.toHaveBeenCalled();
  });

  it('uses the latest callback without restarting the interval', () => {
    const first = vi.fn();
    const second = vi.fn();
    const { rerender } = renderHook(({ cb }) => useInterval(cb, 1000), {
      initialProps: { cb: first },
    });

    act(() => vi.advanceTimersByTime(1000));
    expect(first).toHaveBeenCalledTimes(1);

    rerender({ cb: second });
    act(() => vi.advanceTimersByTime(1000));
    expect(second).toHaveBeenCalledTimes(1);
    expect(first).toHaveBeenCalledTimes(1);
  });

  it('restarts when the delay changes', () => {
    const cb = vi.fn();
    const { rerender } = renderHook(({ d }) => useInterval(cb, d), {
      initialProps: { d: 1000 as number | null },
    });

    act(() => vi.advanceTimersByTime(500));
    rerender({ d: 2000 });
    act(() => vi.advanceTimersByTime(1000));
    expect(cb).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1000));
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('clears the interval on unmount', () => {
    const cb = vi.fn();
    const { unmount } = renderHook(() => useInterval(cb, 1000));
    unmount();
    act(() => vi.advanceTimersByTime(5000));
    expect(cb).not.toHaveBeenCalled();
  });
});
