import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import useUpdateEffect from '../hooks/useUpdateEffect';

describe('useUpdateEffect', () => {
  it('does not run on the initial mount', () => {
    const effect = vi.fn();
    renderHook(() => useUpdateEffect(effect, [0]));
    expect(effect).not.toHaveBeenCalled();
  });

  it('runs when dependencies change', () => {
    const effect = vi.fn();
    const { rerender } = renderHook(
      ({ dep }) => useUpdateEffect(effect, [dep]),
      {
        initialProps: { dep: 0 },
      }
    );

    expect(effect).not.toHaveBeenCalled();

    rerender({ dep: 1 });
    expect(effect).toHaveBeenCalledTimes(1);

    rerender({ dep: 2 });
    expect(effect).toHaveBeenCalledTimes(2);
  });

  it('does not run when dependencies are unchanged', () => {
    const effect = vi.fn();
    const { rerender } = renderHook(
      ({ dep }) => useUpdateEffect(effect, [dep]),
      {
        initialProps: { dep: 0 },
      }
    );

    rerender({ dep: 0 });
    expect(effect).not.toHaveBeenCalled();
  });

  it('runs the cleanup function between updates and on unmount', () => {
    const cleanup = vi.fn();
    const effect = vi.fn(() => cleanup);
    const { rerender, unmount } = renderHook(
      ({ dep }) => useUpdateEffect(effect, [dep]),
      { initialProps: { dep: 0 } }
    );

    rerender({ dep: 1 }); // effect #1, no cleanup yet
    rerender({ dep: 2 }); // cleanup #1, effect #2
    expect(cleanup).toHaveBeenCalledTimes(1);

    unmount(); // cleanup #2
    expect(cleanup).toHaveBeenCalledTimes(2);
  });
});
