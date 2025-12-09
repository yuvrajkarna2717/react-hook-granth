import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

describe('useIntersectionObserver', () => {
  let mockIntersectionObserver;
  let mockObserve;
  let mockUnobserve;
  let mockDisconnect;
  let observerCallback;

  beforeEach(() => {
    mockObserve = vi.fn();
    mockUnobserve = vi.fn();
    mockDisconnect = vi.fn();
    observerCallback = null;

    mockIntersectionObserver = vi.fn((callback, options) => {
      observerCallback = callback;
      return {
        observe: mockObserve,
        unobserve: mockUnobserve,
        disconnect: mockDisconnect,
        root: options?.root ?? null,
        rootMargin: options?.rootMargin ?? '',
        thresholds: Array.isArray(options?.threshold)
          ? options.threshold
          : [options?.threshold ?? 0],
      };
    });

    global.IntersectionObserver = mockIntersectionObserver;
  });

  afterEach(() => {
    vi.clearAllMocks();
    observerCallback = null;

    if (global.IntersectionObserver === mockIntersectionObserver) {
      delete global.IntersectionObserver;
    }
  });

  const renderWithElement = (options) => {
    const { result, rerender, unmount } = renderHook(
      (props) => useIntersectionObserver(props),
      { initialProps: options }
    );

    const mockElement = document.createElement('div');

    act(() => {
      result.current.ref(mockElement);
    });

    return { result, mockElement, rerender, unmount };
  };

  it('should return initial state with a ref function', () => {
    const { result } = renderHook(() => useIntersectionObserver());
    expect(typeof result.current.ref).toBe('function');
    expect(result.current.isIntersecting).toBe(false);
    expect(result.current.entry).toBeUndefined();
  });

  it('should create IntersectionObserver with default options when ref is set', async () => {
    const { mockElement } = renderWithElement();
    await waitFor(() => {
      expect(mockIntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({
          root: null,
          rootMargin: '0%',
          threshold: 0,
        })
      );
      expect(mockObserve).toHaveBeenCalledWith(mockElement);
    });
  });

  it('should create IntersectionObserver with custom options', async () => {
    const options = { rootMargin: '10px', threshold: 0.5 };
    const { mockElement } = renderWithElement(options);

    await waitFor(() => {
      expect(mockIntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({
          root: null,
          ...options,
        })
      );
      expect(mockObserve).toHaveBeenCalledWith(mockElement);
    });
  });

  it('should update state when element enters viewport', async () => {
    const { result, mockElement } = renderWithElement();
    await waitFor(() => expect(typeof observerCallback).toBe('function'));

    const mockEntry = { isIntersecting: true, target: mockElement };

    act(() => observerCallback([mockEntry]));

    await waitFor(() => {
      expect(result.current.isIntersecting).toBe(true);
      expect(result.current.entry).toEqual(mockEntry);
    });
  });

  it('should update state when element leaves viewport', async () => {
    const { result, mockElement } = renderWithElement();
    await waitFor(() => expect(typeof observerCallback).toBe('function'));

    act(() => observerCallback([{ isIntersecting: true, target: mockElement }]));
    await waitFor(() => expect(result.current.isIntersecting).toBe(true));

    const mockEntry = { isIntersecting: false, target: mockElement };
    act(() => observerCallback([mockEntry]));

    await waitFor(() => {
      expect(result.current.isIntersecting).toBe(false);
      expect(result.current.entry).toEqual(mockEntry);
    });
  });

  it('should freeze when freezeOnceVisible is true', async () => {
    const { result, mockElement } = renderWithElement({ freezeOnceVisible: true });
    await waitFor(() => expect(typeof observerCallback).toBe('function'));

    act(() => observerCallback([{ isIntersecting: true, target: mockElement }]));

    await waitFor(() => {
      expect(result.current.isIntersecting).toBe(true);
      expect(mockDisconnect).toHaveBeenCalled();
    });

    act(() =>
      observerCallback([{ isIntersecting: false, target: mockElement }])
    );

    await waitFor(() => {
      expect(result.current.isIntersecting).toBe(true);
    });
  });

  it('should disconnect observer on unmount', async () => {
    const { unmount } = renderWithElement();
    await waitFor(() => expect(mockObserve).toHaveBeenCalled());
    unmount();
    await waitFor(() => expect(mockDisconnect).toHaveBeenCalled());
  });

  it('should recreate observer when options change', async () => {
    const { rerender } = renderWithElement({ threshold: 0.1 });

    await waitFor(() => expect(mockIntersectionObserver).toHaveBeenCalledTimes(1));

    rerender({ threshold: 0.9 });

    await waitFor(() => {
      expect(mockDisconnect).toHaveBeenCalledTimes(1);
      expect(mockIntersectionObserver).toHaveBeenCalledTimes(2);
    });
  });

  it('should handle SSR environment', () => {
    const original = global.IntersectionObserver;
    delete global.IntersectionObserver;

    const { result } = renderHook(() => useIntersectionObserver());

    act(() => result.current.ref(document.createElement('div')));

    expect(result.current.isIntersecting).toBe(false);
    expect(result.current.entry).toBeUndefined();

    global.IntersectionObserver = original;
  });

  it('should reset frozen state when options change', async () => {
    const { result, rerender, mockElement } = renderWithElement({
      freezeOnceVisible: true,
    });

    await waitFor(() => expect(typeof observerCallback).toBe('function'));

    act(() => observerCallback([{ isIntersecting: true, target: mockElement }]));

    await waitFor(() => expect(result.current.isIntersecting).toBe(true));

    rerender({ freezeOnceVisible: false });

    await waitFor(() => expect(mockIntersectionObserver).toHaveBeenCalledTimes(2));

    act(() =>
      observerCallback([{ isIntersecting: false, target: mockElement }])
    );

    await waitFor(() => expect(result.current.isIntersecting).toBe(false));
  });

  it('should disconnect when ref is set to null', async () => {
    const { result } = renderWithElement();

    await waitFor(() => expect(mockObserve).toHaveBeenCalledTimes(1));

    act(() => {
      result.current.ref(null);
    });

    await waitFor(() => {
      expect(mockDisconnect).toHaveBeenCalledTimes(1);
    });
  });

  it('should only process the entry for the tracked element', async () => {
    const { result, mockElement } = renderWithElement();
    await waitFor(() => expect(typeof observerCallback).toBe('function'));

    const otherElement = document.createElement('div');

    act(() =>
      observerCallback([
        { isIntersecting: false, target: otherElement },
        { isIntersecting: false, target: mockElement },
      ])
    );

    await waitFor(() => {
      expect(result.current.isIntersecting).toBe(false);
      expect(result.current.entry.target).toBe(mockElement);
    });

    act(() =>
      observerCallback([
        { isIntersecting: false, target: otherElement },
        { isIntersecting: true, target: mockElement },
      ])
    );

    await waitFor(() => expect(result.current.isIntersecting).toBe(true));
  });

  it('should not recreate observer when options are memoized', async () => {
    const options = { threshold: 0.5 };
    const { rerender } = renderWithElement(options);

    await waitFor(() => expect(mockIntersectionObserver).toHaveBeenCalledTimes(1));

    rerender(options);

    await act(() => new Promise((resolve) => setTimeout(resolve, 30)));

    expect(mockIntersectionObserver).toHaveBeenCalledTimes(1);
  });

  it('should handle rapid visibility changes', async () => {
    const { result, mockElement } = renderWithElement();
    await waitFor(() => expect(typeof observerCallback).toBe('function'));

    act(() =>
      observerCallback([{ isIntersecting: true, target: mockElement }])
    );
    await waitFor(() => expect(result.current.isIntersecting).toBe(true));

    act(() =>
      observerCallback([{ isIntersecting: false, target: mockElement }])
    );
    await waitFor(() => expect(result.current.isIntersecting).toBe(false));

    act(() =>
      observerCallback([{ isIntersecting: true, target: mockElement }])
    );
    await waitFor(() => expect(result.current.isIntersecting).toBe(true));
  });
});
