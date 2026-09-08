import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import useSessionStorage from '../hooks/useSessionStorage';

describe('useSessionStorage', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  it('should return initial value when no stored value exists', () => {
    const { result } = renderHook(() =>
      useSessionStorage('test-key', 'initial')
    );
    expect(result.current[0]).toBe('initial');
  });

  it('should return stored value when it exists', () => {
    sessionStorage.setItem('test-key', JSON.stringify('stored-value'));
    const { result } = renderHook(() =>
      useSessionStorage('test-key', 'initial')
    );
    expect(result.current[0]).toBe('stored-value');
  });

  it('should update sessionStorage when value changes', () => {
    const { result } = renderHook(() =>
      useSessionStorage('test-key', 'initial')
    );

    act(() => {
      result.current[1]('new-value');
    });

    expect(sessionStorage.getItem('test-key')).toBe('"new-value"');
    expect(result.current[0]).toBe('new-value');
  });

  it('should handle objects', () => {
    const initialObj = { name: 'test' };
    const { result } = renderHook(() =>
      useSessionStorage('test-key', initialObj)
    );

    act(() => {
      result.current[1]({ name: 'updated' });
    });

    expect(result.current[0]).toEqual({ name: 'updated' });
  });

  // Regression: malformed stored JSON must not throw; fall back to initial.
  it('should fall back to the initial value when stored JSON is invalid', () => {
    sessionStorage.setItem('test-key', '{not-json');
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() =>
      useSessionStorage('test-key', 'fallback')
    );

    expect(result.current[0]).toBe('fallback');
    errorSpy.mockRestore();
  });

  // Regression: setter supports functional updates like useState.
  it('should support functional updates', () => {
    const { result } = renderHook(() => useSessionStorage('count', 0));

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(1);
    expect(sessionStorage.getItem('count')).toBe('1');
  });

  it('should not throw when writing to sessionStorage fails (e.g. quota)', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const setSpy = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new DOMException('QuotaExceededError');
      });

    const { result } = renderHook(() => useSessionStorage('test-key', 'a'));

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

  // Documents current behavior: changing `key` does not re-hydrate from
  // storage; the current value is persisted under the new key.
  it('persists the current value under a new key when the key changes', () => {
    sessionStorage.setItem('key-a', JSON.stringify('A'));
    sessionStorage.setItem('key-b', JSON.stringify('B'));

    const { result, rerender } = renderHook(
      ({ k }) => useSessionStorage(k, 'x'),
      { initialProps: { k: 'key-a' } }
    );
    expect(result.current[0]).toBe('A');

    rerender({ k: 'key-b' });
    expect(result.current[0]).toBe('A');
    expect(sessionStorage.getItem('key-b')).toBe(JSON.stringify('A'));
  });
});
