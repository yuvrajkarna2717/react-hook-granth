import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import useSet from '../hooks/useSet';

describe('useSet', () => {
  it('initializes empty by default', () => {
    const { result } = renderHook(() => useSet<number>());
    expect(result.current[0].size).toBe(0);
  });

  it('seeds from an iterable', () => {
    const { result } = renderHook(() => useSet([1, 2, 3]));
    expect(Array.from(result.current[0])).toEqual([1, 2, 3]);
  });

  it('adds items (and ignores duplicates)', () => {
    const { result } = renderHook(() => useSet<number>());
    act(() => result.current[1].add(1));
    act(() => result.current[1].add(1));
    expect(result.current[0].size).toBe(1);
  });

  it('removes items', () => {
    const { result } = renderHook(() => useSet([1, 2]));
    act(() => result.current[1].remove(1));
    expect(Array.from(result.current[0])).toEqual([2]);
  });

  it('toggles items', () => {
    const { result } = renderHook(() => useSet<string>());
    act(() => result.current[1].toggle('a'));
    expect(result.current[0].has('a')).toBe(true);
    act(() => result.current[1].toggle('a'));
    expect(result.current[0].has('a')).toBe(false);
  });

  it('reports membership with has', () => {
    const { result } = renderHook(() => useSet([5]));
    expect(result.current[1].has(5)).toBe(true);
    expect(result.current[1].has(6)).toBe(false);
  });

  it('clears and resets', () => {
    const { result } = renderHook(() => useSet([1, 2]));
    act(() => result.current[1].add(3));
    act(() => result.current[1].clear());
    expect(result.current[0].size).toBe(0);
    act(() => result.current[1].reset());
    expect(Array.from(result.current[0])).toEqual([1, 2]);
  });

  it('produces a new Set reference on mutation', () => {
    const { result } = renderHook(() => useSet<number>());
    const before = result.current[0];
    act(() => result.current[1].add(1));
    expect(result.current[0]).not.toBe(before);
  });
});
