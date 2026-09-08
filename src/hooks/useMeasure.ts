import {
  useCallback,
  useLayoutEffect,
  useEffect,
  useRef,
  useState,
  RefObject,
} from 'react';

export interface Bounds {
  width: number;
  height: number;
}

// useLayoutEffect warns during SSR; fall back to useEffect on the server.
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Measure the size of a DOM element.
 *
 * Re-measures on window resize and, where supported, on element resize via
 * `ResizeObserver` (so content-driven size changes are captured too).
 * @returns Tuple of `[ref, bounds]`
 */
export default function useMeasure<T extends HTMLElement = HTMLElement>(): [
  RefObject<T | null>,
  Bounds,
] {
  const ref = useRef<T>(null);
  const [bounds, setBounds] = useState<Bounds>({ width: 0, height: 0 });

  const measure = useCallback((): void => {
    if (ref.current) {
      const { width, height } = ref.current.getBoundingClientRect();
      setBounds({ width, height });
    }
  }, []);

  useIsomorphicLayoutEffect(() => {
    measure();

    let observer: ResizeObserver | undefined;
    if (
      typeof ResizeObserver !== 'undefined' &&
      ref.current instanceof Element
    ) {
      observer = new ResizeObserver(() => measure());
      observer.observe(ref.current);
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', measure);
    }

    return () => {
      observer?.disconnect();
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', measure);
      }
    };
  }, [measure]);

  return [ref, bounds];
}
