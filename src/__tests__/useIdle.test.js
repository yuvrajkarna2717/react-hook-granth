import { renderHook, act } from '@testing-library/react-hooks';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import useIdle from '../hooks/useIdle';

describe('useIdle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return false initially', () => {
    const { result } = renderHook(() => useIdle(1000));
    expect(result.current).toBe(false);
  });

  it('should return true after timeout', () => {
    const { result } = renderHook(() => useIdle(1000));
    
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    
    expect(result.current).toBe(true);
  });

  it('should reset idle state on user activity', () => {
    const { result } = renderHook(() => useIdle(1000));
    
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current).toBe(true);
    
    act(() => {
      window.dispatchEvent(new Event('mousemove'));
    });
    expect(result.current).toBe(false);
  });
});