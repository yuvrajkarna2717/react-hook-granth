import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import useIsMounted from '../hooks/useIsMounted';

describe('useIsMounted', () => {
  it('returns true while mounted', () => {
    const { result } = renderHook(() => useIsMounted());
    expect(result.current()).toBe(true);
  });

  it('returns false after unmount', () => {
    const { result, unmount } = renderHook(() => useIsMounted());
    const isMounted = result.current;
    expect(isMounted()).toBe(true);
    unmount();
    expect(isMounted()).toBe(false);
  });

  it('returns a stable getter across renders', () => {
    const { result, rerender } = renderHook(() => useIsMounted());
    const first = result.current;
    rerender();
    expect(result.current).toBe(first);
  });
});
