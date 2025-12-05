import { renderHook, act } from '@testing-library/react-hooks';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import useSessionStorage from '../hooks/useSessionStorage';

describe('useSessionStorage', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  it('should return initial value when no stored value exists', () => {
    const { result } = renderHook(() => useSessionStorage('test-key', 'initial'));
    expect(result.current[0]).toBe('initial');
  });

  it('should return stored value when it exists', () => {
    sessionStorage.setItem('test-key', JSON.stringify('stored-value'));
    const { result } = renderHook(() => useSessionStorage('test-key', 'initial'));
    expect(result.current[0]).toBe('stored-value');
  });

  it('should update sessionStorage when value changes', () => {
    const { result } = renderHook(() => useSessionStorage('test-key', 'initial'));
    
    act(() => {
      result.current[1]('new-value');
    });
    
    expect(sessionStorage.getItem('test-key')).toBe('"new-value"');
    expect(result.current[0]).toBe('new-value');
  });

  it('should handle objects', () => {
    const initialObj = { name: 'test' };
    const { result } = renderHook(() => useSessionStorage('test-key', initialObj));
    
    act(() => {
      result.current[1]({ name: 'updated' });
    });
    
    expect(result.current[0]).toEqual({ name: 'updated' });
  });
});