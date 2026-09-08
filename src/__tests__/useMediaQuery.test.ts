import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import useMediaQuery from '../hooks/useMediaQuery';

const matchMediaMock = (): Mock => window.matchMedia as unknown as Mock;

describe('useMediaQuery', () => {
  beforeEach(() => {
    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    });
  });

  it('should return initial match state', () => {
    matchMediaMock().mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(true);
  });

  it('should return false when query does not match', () => {
    matchMediaMock().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(false);
  });

  it('should add and remove event listeners', () => {
    const mockAddEventListener = vi.fn();
    const mockRemoveEventListener = vi.fn();

    matchMediaMock().mockReturnValue({
      matches: false,
      addEventListener: mockAddEventListener,
      removeEventListener: mockRemoveEventListener,
    });

    const { unmount } = renderHook(() => useMediaQuery('(min-width: 768px)'));

    expect(mockAddEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function)
    );

    unmount();
    expect(mockRemoveEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function)
    );
  });

  it('should update when the media query change event fires', () => {
    let changeListener: ((e: { matches: boolean }) => void) | undefined;
    matchMediaMock().mockReturnValue({
      matches: false,
      addEventListener: vi.fn((_type: string, cb: () => void) => {
        changeListener = cb;
      }),
      removeEventListener: vi.fn(),
    });

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(false);

    act(() => changeListener?.({ matches: true }));
    expect(result.current).toBe(true);

    act(() => changeListener?.({ matches: false }));
    expect(result.current).toBe(false);
  });

  it('should re-subscribe when the query changes', () => {
    const add = vi.fn();
    const remove = vi.fn();
    matchMediaMock().mockReturnValue({
      matches: false,
      addEventListener: add,
      removeEventListener: remove,
    });

    const { rerender } = renderHook(({ q }) => useMediaQuery(q), {
      initialProps: { q: '(min-width: 768px)' },
    });
    expect(add).toHaveBeenCalledTimes(1);

    rerender({ q: '(min-width: 1024px)' });

    // Old subscription torn down, new one created.
    expect(remove).toHaveBeenCalledTimes(1);
    expect(add).toHaveBeenCalledTimes(2);
  });
});
