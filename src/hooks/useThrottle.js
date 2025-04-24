import { useCallback, useEffect, useRef } from "react";

/**
 * Throttle a function to only run once every specified delay.
 * @param {Function} callback - The function to throttle.
 * @param {number} delay - Delay in ms.
 * @returns {Function} - Throttled version of the callback.
 */
export default function useThrottle(callback, delay) {
  const lastCallRef = useRef(0);

  const throttledCallback = useCallback(
    (...args) => {
      const now = new Date().getTime();
      if (now - lastCallRef.current >= delay) {
        callback(...args);
        lastCallRef.current = now;
      }
    },
    [callback, delay]
  );

  return throttledCallback;
}
