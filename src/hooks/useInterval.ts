import { useEffect, useRef } from 'react';

/**
 * Run a callback on a fixed interval, without stale-closure bugs.
 *
 * Pass `null` as the delay to pause the interval. The latest callback is always
 * used, and the interval restarts when the delay changes.
 * @param callback - Function to run each tick.
 * @param delay - Interval in milliseconds, or `null` to pause.
 */
export default function useInterval(
  callback: () => void,
  delay: number | null
): void {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}
