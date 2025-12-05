import { useCallback, useLayoutEffect, useRef, useState } from "react";

interface Bounds {
  width: number;
  height: number;
}

/**
 * Measure the size of a DOM element.
 * @returns Tuple of [ref, bounds]
 */
export default function useMeasure(): [React.RefObject<HTMLElement>, Bounds] {
  const ref = useRef<HTMLElement>(null);
  const [bounds, setBounds] = useState<Bounds>({ width: 0, height: 0 });

  const measure = useCallback((): void => {
    if (ref.current) {
      const { width, height } = ref.current.getBoundingClientRect();
      setBounds({ width, height });
    }
  }, []);

  useLayoutEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  return [ref, bounds];
}