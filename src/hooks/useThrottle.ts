import { useCallback, useRef } from 'react';

/**
 * Throttle a function to only run once every specified delay.
 * @param callback - The function to throttle
 * @param delay - Delay in milliseconds
 * @returns Throttled version of the callback
 */
export default function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const lastCallRef = useRef<number>(0);

  const throttledCallback = useCallback(
    (...args: Parameters<T>): void => {
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
