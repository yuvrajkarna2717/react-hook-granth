import { useEffect, useState } from "react";

/**
 * Debounce a value to delay updates.
 * @param {T} value - Value to debounce.
 * @param {number} delay - Delay in ms.
 * @returns {T} - Debounced value.
 */
export default function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
