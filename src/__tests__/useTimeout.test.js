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
});
