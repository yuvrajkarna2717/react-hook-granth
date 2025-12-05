import { useEffect, useRef } from "react";

/**
 * Store the previous value of a state or prop.
 * @param value - The current value
 * @returns The previous value
 */
export default function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}