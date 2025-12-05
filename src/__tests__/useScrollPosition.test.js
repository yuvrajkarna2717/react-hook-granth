import { renderHook, act } from '@testing-library/react-hooks';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import useScrollPosition from '../hooks/useScrollPosition';

describe('useScrollPosition', () => {
  beforeEach(() => {
    // Mock window scroll properties
    Object.defineProperty(window, 'scrollX', { writable: true, value: 0 });
    Object.defineProperty(window, 'scrollY', { writable: true, value: 0 });
  });

  it('should return initial scroll position', () => {
    const { result } = renderHook(() => useScrollPosition());
    expect(result.current).toEqual({ x: 0, y: 0 });
  });

  it('should update position on scroll', () => {
    const { result } = renderHook(() => useScrollPosition());

    act(() => {
      Object.defineProperty(window, 'scrollX', { value: 100 });
      Object.defineProperty(window, 'scrollY', { value: 200 });
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current).toEqual({ x: 100, y: 200 });
  });

  it('should cleanup scroll listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useScrollPosition());

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
  });
});