import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import useDebouncedCallback from '../hooks/useDebouncedCallback';

describe('useDebouncedCallback', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('invokes only after the delay elapses', () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(fn, 300));

    act(() => result.current('a'));
    expect(fn).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(300));
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('a');
  });

  it('collapses rapid calls into the latest args', () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(fn, 300));

    act(() => {
      result.current('a');
      result.current('b');
      result.current('c');
    });
    act(() => vi.advanceTimersByTime(300));

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('c');
  });

  it('cancel prevents a pending call', () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(fn, 300));

    act(() => result.current('a'));
    act(() => result.current.cancel());
    act(() => vi.advanceTimersByTime(300));

    expect(fn).not.toHaveBeenCalled();
  });

  it('flush invokes immediately with the latest args', () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(fn, 300));

    act(() => result.current('x'));
    act(() => result.current.flush());
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('x');

    // Timer already cleared by flush.
    act(() => vi.advanceTimersByTime(300));
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('uses the latest callback', () => {
    const first = vi.fn();
    const second = vi.fn();
    const { result, rerender } = renderHook(
      ({ cb }) => useDebouncedCallback(cb, 300),
      { initialProps: { cb: first } }
    );

    act(() => result.current('a'));
    rerender({ cb: second });
    act(() => vi.advanceTimersByTime(300));

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledWith('a');
  });

  it('cancels a pending call on unmount', () => {
    const fn = vi.fn();
    const { result, unmount } = renderHook(() => useDebouncedCallback(fn, 300));
    act(() => result.current('a'));
    unmount();
    act(() => vi.advanceTimersByTime(300));
    expect(fn).not.toHaveBeenCalled();
  });
});
