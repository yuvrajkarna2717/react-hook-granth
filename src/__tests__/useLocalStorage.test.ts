import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import useLocalStorage from '../hooks/useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should return initial value when no stored value exists', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    expect(result.current[0]).toBe('initial');
  });

  it('should return stored value when it exists', () => {
    localStorage.setItem('test-key', JSON.stringify('stored-value'));
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    expect(result.current[0]).toBe('stored-value');
  });

  it('should update localStorage when value changes', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    act(() => {
      result.current[1]('new-value');
    });

    expect(localStorage.getItem('test-key')).toBe('"new-value"');
    expect(result.current[0]).toBe('new-value');
  });

  it('should handle objects', () => {
    const initialObj = { name: 'test' };
    const { result } = renderHook(() =>
      useLocalStorage('test-key', initialObj)
    );

    act(() => {
      result.current[1]({ name: 'updated' });
    });

    expect(result.current[0]).toEqual({ name: 'updated' });
  });

  // Regression: setter supports functional updates like useState.
  it('should support functional updates', () => {
    const { result } = renderHook(() => useLocalStorage('count', 0));

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(1);
    expect(localStorage.getItem('count')).toBe('1');
  });

  // Regression: malformed stored JSON must not throw; fall back to initial.
  it('should fall back to the initial value when stored JSON is invalid', () => {
    localStorage.setItem('test-key', '{not-json');
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'fallback')
    );

    expect(result.current[0]).toBe('fallback');
    errorSpy.mockRestore();
  });

  it('should not throw when writing to localStorage fails (e.g. quota)', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const setSpy = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new DOMException('QuotaExceededError');
      });

    const { result } = renderHook(() => useLocalStorage('test-key', 'a'));

    expect(() =>
      act(() => {
        result.current[1]('b');
      })
    ).not.toThrow();
    expect(result.current[0]).toBe('b');
    expect(errorSpy).toHaveBeenCalled();

    setSpy.mockRestore();
    errorSpy.mockRestore();
  });

  // Documents current behavior: the stored value is read once for the initial
  // state. Changing `key` does NOT re-hydrate from storage; instead the current
  // value is persisted under the new key (the effect writes on key change).
  it('persists the current value under a new key when the key changes', () => {
    localStorage.setItem('key-a', JSON.stringify('A'));
    localStorage.setItem('key-b', JSON.stringify('B'));

    const { result, rerender } = renderHook(
      ({ k }) => useLocalStorage(k, 'x'),
      {
        initialProps: { k: 'key-a' },
      }
    );
    expect(result.current[0]).toBe('A');

    rerender({ k: 'key-b' });
    // Value is retained (not re-read from key-b) and written under key-b.
    expect(result.current[0]).toBe('A');
    expect(localStorage.getItem('key-b')).toBe(JSON.stringify('A'));
  });
});
