import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import useArray from '../hooks/useArray';

describe('useArray', () => {
  it('initializes with the given array', () => {
    const { result } = renderHook(() => useArray([1, 2]));
    expect(result.current[0]).toEqual([1, 2]);
  });

  it('pushes one or more items', () => {
    const { result } = renderHook(() => useArray<number>([]));
    act(() => result.current[1].push(1));
    act(() => result.current[1].push(2, 3));
    expect(result.current[0]).toEqual([1, 2, 3]);
  });

  it('removes at an index', () => {
    const { result } = renderHook(() => useArray([1, 2, 3]));
    act(() => result.current[1].removeAt(1));
    expect(result.current[0]).toEqual([1, 3]);
  });

  it('updates at an index', () => {
    const { result } = renderHook(() => useArray([1, 2, 3]));
    act(() => result.current[1].updateAt(1, 20));
    expect(result.current[0]).toEqual([1, 20, 3]);
  });

  it('inserts at an index', () => {
    const { result } = renderHook(() => useArray([1, 3]));
    act(() => result.current[1].insertAt(1, 2));
    expect(result.current[0]).toEqual([1, 2, 3]);
  });

  it('filters items', () => {
    const { result } = renderHook(() => useArray([1, 2, 3, 4]));
    act(() => result.current[1].filter((n) => n % 2 === 0));
    expect(result.current[0]).toEqual([2, 4]);
  });

  it('sets and clears', () => {
    const { result } = renderHook(() => useArray<number>([1]));
    act(() => result.current[1].set([9, 8]));
    expect(result.current[0]).toEqual([9, 8]);
    act(() => result.current[1].clear());
    expect(result.current[0]).toEqual([]);
  });

  it('produces a new array reference on mutation', () => {
    const { result } = renderHook(() => useArray([1]));
    const before = result.current[0];
    act(() => result.current[1].push(2));
    expect(result.current[0]).not.toBe(before);
  });
});
