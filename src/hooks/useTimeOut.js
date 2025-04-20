import { useCallback, useEffect, useRef } from "react";

/**
 * Run a function after a delay. Supports cancel and reset.
 * @param {Function} callback - Function to run after delay.
 * @param {number} delay - Delay in ms.
 */
function useTimeout(callback, delay) {
  const timeoutRef = useRef(null);
  const savedCallback = useRef(callback);

  // Update the latest callback if it changes
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const clear = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    clear();
    timeoutRef.current = setTimeout(() => {
      savedCallback.current();
    }, delay);
  }, [clear, delay]);

  useEffect(() => {
    reset(); // start the timeout

    return clear; // cleanup on unmount or delay change
  }, [delay, reset, clear]);

  return { clear, reset };
}

export default useTimeout;
