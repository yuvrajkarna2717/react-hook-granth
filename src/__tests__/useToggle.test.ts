import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import useToggle from '../hooks/useToggle';

describe('useToggle', () => {
  it('defaults to false', () => {
    const { result } = renderHook(() => useToggle());
    expect(result.current[0]).toBe(false);
  });

  it('accepts an initial value', () => {
    const { result } = renderHook(() => useToggle(true));
    expect(result.current[0]).toBe(true);
  });

  it('toggles the value', () => {
    const { result } = renderHook(() => useToggle());
    act(() => result.current[1].toggle());
    expect(result.current[0]).toBe(true);
    act(() => result.current[1].toggle());
    expect(result.current[0]).toBe(false);
  });

  it('setTrue / setFalse set explicit values', () => {
    const { result } = renderHook(() => useToggle());
    act(() => result.current[1].setTrue());
    expect(result.current[0]).toBe(true);
    act(() => result.current[1].setFalse());
    expect(result.current[0]).toBe(false);
  });

  it('set assigns a specific value', () => {
    const { result } = renderHook(() => useToggle());
    act(() => result.current[1].set(true));
    expect(result.current[0]).toBe(true);
  });

  it('keeps action identities stable across renders', () => {
    const { result, rerender } = renderHook(() => useToggle());
    const first = result.current[1];
    act(() => result.current[1].toggle());
    rerender();
    expect(result.current[1]).toBe(first);
    expect(result.current[1].toggle).toBe(first.toggle);
  });
});
