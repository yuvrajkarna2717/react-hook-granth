import { useCallback, useLayoutEffect, useRef, useState } from "react";

/**
 * Measure the size of a DOM element.
 * @returns {[ref, bounds]}
 */
export default function useMeasure() {
  const ref = useRef(null);
  const [bounds, setBounds] = useState({ width: 0, height: 0 });

  const measure = useCallback(() => {
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
