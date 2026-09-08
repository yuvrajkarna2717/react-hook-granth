import { renderHook, render, act } from '@testing-library/react';
import { createElement } from 'react';
import { describe, it, expect, vi, afterEach, type Mock } from 'vitest';
import useMeasure from '../hooks/useMeasure';
import { setRefCurrent } from './testUtils';

describe('useMeasure', () => {
  it('should return ref and initial bounds', () => {
    const { result } = renderHook(() => useMeasure());
    const [ref, bounds] = result.current;

    expect(ref.current).toBe(null);
    expect(bounds).toEqual({ width: 0, height: 0 });
  });

  it('should measure element when ref is set', async () => {
    const mockElement = {
      getBoundingClientRect: vi.fn(() => ({ width: 100, height: 50 })),
    } as unknown as HTMLElement;

    const { result } = renderHook(() => useMeasure());
    const [ref] = result.current;

    // Simulate setting the ref and trigger resize
    await act(async () => {
      setRefCurrent(ref, mockElement);
      window.dispatchEvent(new Event('resize'));
    });

    expect(mockElement.getBoundingClientRect).toHaveBeenCalled();
  });

  describe('ResizeObserver', () => {
    let observe: Mock;
    let disconnect: Mock;
    let roCallback: (() => void) | undefined;
    let OriginalRO: typeof ResizeObserver | undefined;

    afterEach(() => {
      if (OriginalRO) globalThis.ResizeObserver = OriginalRO;
      else delete (globalThis as { ResizeObserver?: unknown }).ResizeObserver;
      vi.restoreAllMocks();
    });

    function installMockRO() {
      observe = vi.fn();
      disconnect = vi.fn();
      OriginalRO = globalThis.ResizeObserver;
      globalThis.ResizeObserver = vi.fn((cb: () => void) => {
        roCallback = cb;
        return { observe, disconnect, unobserve: vi.fn() };
      }) as unknown as typeof ResizeObserver;
    }

    // Mount a real component so `ref.current` is a genuine Element during the
    // layout effect, which is what triggers the ResizeObserver branch.
    function renderWithRealElement() {
      let bounds: { width: number; height: number } | undefined;
      function Probe() {
        const [ref, b] = useMeasure<HTMLDivElement>();
        bounds = b;
        return createElement('div', { ref });
      }
      const utils = render(createElement(Probe));
      return { ...utils, getBounds: () => bounds };
    }

    it('observes the element and re-measures on resize entries', () => {
      installMockRO();
      const rectSpy = vi
        .spyOn(HTMLDivElement.prototype, 'getBoundingClientRect')
        .mockReturnValue({ width: 120, height: 40 } as DOMRect);

      const { getBounds } = renderWithRealElement();

      expect(observe).toHaveBeenCalledTimes(1);
      expect(getBounds()).toEqual({ width: 120, height: 40 });

      rectSpy.mockReturnValue({ width: 200, height: 80 } as DOMRect);
      act(() => roCallback?.());
      expect(getBounds()).toEqual({ width: 200, height: 80 });
    });

    it('disconnects the observer on unmount', () => {
      installMockRO();
      vi.spyOn(
        HTMLDivElement.prototype,
        'getBoundingClientRect'
      ).mockReturnValue({ width: 10, height: 10 } as DOMRect);

      const { unmount } = renderWithRealElement();
      unmount();
      expect(disconnect).toHaveBeenCalledTimes(1);
    });
  });
});
