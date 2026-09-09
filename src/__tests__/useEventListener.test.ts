import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useRef } from 'react';
import useEventListener from '../hooks/useEventListener';
import { setRefCurrent } from './testUtils';

describe('useEventListener', () => {
  it('listens on window by default', () => {
    const handler = vi.fn();
    renderHook(() => useEventListener('resize', handler));

    act(() => window.dispatchEvent(new Event('resize')));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('removes the listener on unmount', () => {
    const handler = vi.fn();
    const { unmount } = renderHook(() => useEventListener('resize', handler));

    unmount();
    act(() => window.dispatchEvent(new Event('resize')));
    expect(handler).not.toHaveBeenCalled();
  });

  it('uses the latest handler without re-subscribing', () => {
    const addSpy = vi.spyOn(window, 'addEventListener');
    const first = vi.fn();
    const second = vi.fn();

    const { rerender } = renderHook(({ h }) => useEventListener('resize', h), {
      initialProps: { h: first },
    });
    const callsAfterMount = addSpy.mock.calls.filter(
      (c) => c[0] === 'resize'
    ).length;

    rerender({ h: second });
    // No new subscription for the same event.
    expect(addSpy.mock.calls.filter((c) => c[0] === 'resize').length).toBe(
      callsAfterMount
    );

    act(() => window.dispatchEvent(new Event('resize')));
    expect(second).toHaveBeenCalledTimes(1);
    expect(first).not.toHaveBeenCalled();
    addSpy.mockRestore();
  });

  it('attaches to a ref element', () => {
    const handler = vi.fn();
    const el = document.createElement('div');

    const { result } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(null);
      setRefCurrent(ref, el);
      useEventListener('click', handler, ref);
      return ref;
    });

    act(() => result.current.current?.dispatchEvent(new Event('click')));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('attaches to document', () => {
    const handler = vi.fn();
    renderHook(() => useEventListener('click', handler, document));
    act(() => document.dispatchEvent(new Event('click')));
    expect(handler).toHaveBeenCalledTimes(1);
  });
});
