import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import usePageVisibility from '../hooks/usePageVisibility';

function setVisibility(state: 'visible' | 'hidden') {
  Object.defineProperty(document, 'visibilityState', {
    configurable: true,
    get: () => state,
  });
  document.dispatchEvent(new Event('visibilitychange'));
}

describe('usePageVisibility', () => {
  afterEach(() => {
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => 'visible',
    });
  });

  it('returns true when visible initially', () => {
    const { result } = renderHook(() => usePageVisibility());
    expect(result.current).toBe(true);
  });

  it('updates to false when hidden and back to true', () => {
    const { result } = renderHook(() => usePageVisibility());

    act(() => setVisibility('hidden'));
    expect(result.current).toBe(false);

    act(() => setVisibility('visible'));
    expect(result.current).toBe(true);
  });

  it('removes the listener on unmount', () => {
    const removeSpy = vi.spyOn(document, 'removeEventListener');
    const { unmount } = renderHook(() => usePageVisibility());
    unmount();
    expect(removeSpy).toHaveBeenCalledWith(
      'visibilitychange',
      expect.any(Function)
    );
    removeSpy.mockRestore();
  });
});
