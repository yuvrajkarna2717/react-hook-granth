import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import useTimeout from '../hooks/useTimeout';

describe('useTimeout', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should call callback after delay', () => {
    const mockCallback = vi.fn();
    renderHook(() => useTimeout(mockCallback, 1000));

    expect(mockCallback).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('should provide clear function', () => {
    const mockCallback = vi.fn();
    const { result } = renderHook(() => useTimeout(mockCallback, 1000));

    act(() => {
      result.current.clear();
    });

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should provide reset function', () => {
    const mockCallback = vi.fn();
    const { result } = renderHook(() => useTimeout(mockCallback, 1000));

    act(() => {
      vi.advanceTimersByTime(500);
      result.current.reset();
    });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(mockCallback).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('should update callback when it changes', () => {
    const mockCallback1 = vi.fn();
    const mockCallback2 = vi.fn();

    const { rerender } = renderHook(
      ({ callback }) => useTimeout(callback, 1000),
      { initialProps: { callback: mockCallback1 } }
    );

    rerender({ callback: mockCallback2 });

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(mockCallback1).not.toHaveBeenCalled();
    expect(mockCallback2).toHaveBeenCalledTimes(1);
  });

  it('should restart the timer when delay changes', () => {
    const mockCallback = vi.fn();
    const { rerender } = renderHook(
      ({ delay }) => useTimeout(mockCallback, delay),
      { initialProps: { delay: 1000 } }
    );

    act(() => vi.advanceTimersByTime(900));
    rerender({ delay: 2000 }); // new delay restarts the timer

    act(() => vi.advanceTimersByTime(1900));
    // Timer restarted with 2000ms; 1900ms after restart is not enough.
    expect(mockCallback).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(100));
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('should not fire after unmount', () => {
    const mockCallback = vi.fn();
    const { unmount } = renderHook(() => useTimeout(mockCallback, 1000));

    unmount();
    act(() => vi.advanceTimersByTime(1000));

    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should allow reset to re-arm after firing', () => {
    const mockCallback = vi.fn();
    const { result } = renderHook(() => useTimeout(mockCallback, 1000));

    act(() => vi.advanceTimersByTime(1000));
    expect(mockCallback).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.reset();
      vi.advanceTimersByTime(1000);
    });
    expect(mockCallback).toHaveBeenCalledTimes(2);
  });
});
