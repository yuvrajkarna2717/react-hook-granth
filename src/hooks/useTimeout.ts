import { useCallback, useEffect, useRef } from 'react';

interface UseTimeoutReturn {
  clear: () => void;
  reset: () => void;
}

/**
 * Run a function after a delay. Supports cancel and reset.
 * @param callback - Function to run after delay
 * @param delay - Delay in milliseconds
 * @returns Object with clear and reset functions
 */
function useTimeout(callback: () => void, delay: number): UseTimeoutReturn {
  const timeoutRef = useRef<number | null>(null);
  const savedCallback = useRef<() => void>(callback);

  // Update the latest callback if it changes
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const clear = useCallback((): void => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const reset = useCallback((): void => {
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
