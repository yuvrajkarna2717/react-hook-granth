import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import useIdle from '../hooks/useIdle';

describe('useIdle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return false initially', () => {
    const { result } = renderHook(() => useIdle(1000));
    expect(result.current).toBe(false);
  });

  it('should return true after timeout', () => {
    const { result } = renderHook(() => useIdle(1000));

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current).toBe(true);
  });

  it('should reset idle state on user activity', () => {
    const { result } = renderHook(() => useIdle(1000));

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current).toBe(true);

    act(() => {
      window.dispatchEvent(new Event('mousemove'));
    });
    expect(result.current).toBe(false);
  });

  it('should stay active while activity occurs before the timeout', () => {
    const { result } = renderHook(() => useIdle(1000));

    act(() => vi.advanceTimersByTime(800));
    act(() => window.dispatchEvent(new Event('keydown')));
    act(() => vi.advanceTimersByTime(800)); // 800ms since last activity < 1000

    expect(result.current).toBe(false);
  });

  it('should respond to different activity events', () => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    for (const type of events) {
      const { result, unmount } = renderHook(() => useIdle(1000));
      act(() => vi.advanceTimersByTime(1000));
      expect(result.current).toBe(true);
      act(() => window.dispatchEvent(new Event(type)));
      expect(result.current).toBe(false);
      unmount();
    }
  });

  it('should re-arm with the new timeout when it changes', () => {
    const { result, rerender } = renderHook(({ t }) => useIdle(t), {
      initialProps: { t: 1000 },
    });

    rerender({ t: 2000 });

    act(() => vi.advanceTimersByTime(1000));
    expect(result.current).toBe(false); // new timeout is 2000ms

    act(() => vi.advanceTimersByTime(1000));
    expect(result.current).toBe(true);
  });

  it('should remove listeners on unmount', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useIdle(1000));
    unmount();
    expect(removeSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
    removeSpy.mockRestore();
  });
});
