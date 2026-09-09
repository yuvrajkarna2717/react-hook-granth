import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import useLatest from '../hooks/useLatest';

describe('useLatest', () => {
  it('holds the initial value', () => {
    const { result } = renderHook(() => useLatest('a'));
    expect(result.current.current).toBe('a');
  });

  it('updates to the latest value on rerender', () => {
    const { result, rerender } = renderHook(({ v }) => useLatest(v), {
      initialProps: { v: 1 },
    });
    expect(result.current.current).toBe(1);

    rerender({ v: 2 });
    expect(result.current.current).toBe(2);
  });

  it('keeps a stable ref identity', () => {
    const { result, rerender } = renderHook(({ v }) => useLatest(v), {
      initialProps: { v: 1 },
    });
    const ref = result.current;
    rerender({ v: 99 });
    expect(result.current).toBe(ref);
    expect(ref.current).toBe(99);
  });
});
