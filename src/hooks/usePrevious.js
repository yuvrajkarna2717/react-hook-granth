import { useEffect, useRef } from "react";

/**
 * Store the previous value of a state or prop.
 * @param {*} value
 * @returns {*} previous value
 */
export default function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
