import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import useControllableState from '../hooks/useControllableState';

describe('useControllableState', () => {
  it('works uncontrolled from defaultValue', () => {
    const { result } = renderHook(() =>
      useControllableState<number>({ defaultValue: 0 })
    );
    expect(result.current[0]).toBe(0);
    act(() => result.current[1](5));
    expect(result.current[0]).toBe(5);
  });

  it('calls onChange in uncontrolled mode', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useControllableState<number>({ defaultValue: 0, onChange })
    );
    act(() => result.current[1](3));
    expect(onChange).toHaveBeenCalledWith(3);
    expect(result.current[0]).toBe(3);
  });

  it('is controlled when value is provided (does not self-update)', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useControllableState<number>({ value: 10, defaultValue: 0, onChange })
    );
    expect(result.current[0]).toBe(10);

    act(() => result.current[1](11));
    // Controlled: onChange fires but internal value stays at the prop.
    expect(onChange).toHaveBeenCalledWith(11);
    expect(result.current[0]).toBe(10);
  });

  it('reflects updated controlled value from props', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useControllableState<number>({ value, defaultValue: 0 }),
      { initialProps: { value: 1 } }
    );
    expect(result.current[0]).toBe(1);
    rerender({ value: 2 });
    expect(result.current[0]).toBe(2);
  });

  it('supports functional updates in uncontrolled mode', () => {
    const { result } = renderHook(() =>
      useControllableState<number>({ defaultValue: 1 })
    );
    act(() => result.current[1]((prev) => prev + 4));
    expect(result.current[0]).toBe(5);
  });
});
