import { useEffect, useRef } from 'react';

/**
 * Track the previous value of a state or prop.
 *
 * Returns `undefined` on the first render, then the value from the render
 * before the current one.
 * @param value - The current value
 * @returns The value from the previous render, or `undefined` initially
 */
export default function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
