import { useCallback, useEffect, useRef } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunction = (...args: any[]) => any;

export type UseThrottleReturn<T extends AnyFunction> = (
  ...args: Parameters<T>
) => void;

/**
 * Throttle a callback so it runs at most once per `delay` window.
 *
 * The leading call fires immediately; a trailing call fires at the end of the
 * window with the most recent arguments so the final invocation in a burst is
 * never dropped.
 * @param callback - The function to throttle
 * @param delay - Minimum interval between calls, in milliseconds
 * @returns A throttled version of the callback
 */
export default function useThrottle<T extends AnyFunction>(
  callback: T,
  delay: number
): UseThrottleReturn<T> {
  const lastCallRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastArgsRef = useRef<Parameters<T> | null>(null);

  // Keep the latest callback without re-creating the throttled function,
  // avoiding stale closures over `callback`.
  const callbackRef = useRef<T>(callback);
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Clear any pending trailing call on unmount to prevent leaks / late fires.
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return useCallback(
    (...args: Parameters<T>): void => {
      const now = Date.now();
      const remaining = delay - (now - lastCallRef.current);
      lastArgsRef.current = args;

      if (remaining <= 0) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        lastCallRef.current = now;
        callbackRef.current(...args);
      } else if (!timeoutRef.current) {
        // Schedule the trailing edge for the remainder of the window.
        timeoutRef.current = setTimeout(() => {
          lastCallRef.current = Date.now();
          timeoutRef.current = null;
          if (lastArgsRef.current) {
            callbackRef.current(...lastArgsRef.current);
          }
        }, remaining);
      }
    },
    [delay]
  );
}
