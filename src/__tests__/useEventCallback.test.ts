import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import useEventCallback from '../hooks/useEventCallback';

describe('useEventCallback', () => {
  it('returns a stable function identity across renders', () => {
    const { result, rerender } = renderHook(({ fn }) => useEventCallback(fn), {
      initialProps: { fn: (() => 1) as () => number },
    });
    const first = result.current;
    rerender({ fn: () => 2 });
    expect(result.current).toBe(first);
  });

  it('always invokes the latest callback', () => {
    const first = vi.fn();
    const second = vi.fn();
    const { result, rerender } = renderHook(({ fn }) => useEventCallback(fn), {
      initialProps: { fn: first },
    });

    rerender({ fn: second });
    act(() => {
      result.current();
    });

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });

  it('forwards arguments and returns the callback result', () => {
    const { result } = renderHook(() =>
      useEventCallback((a: number, b: number) => a + b)
    );
    let sum = 0;
    act(() => {
      sum = result.current(2, 3);
    });
    expect(sum).toBe(5);
  });
});
