import { useRef, MutableRefObject } from 'react';

/**
 * Keep a ref pointing at the most recent value.
 *
 * Useful for reading the latest state/props inside callbacks, timers, or
 * subscriptions without adding them to dependency arrays (avoids stale
 * closures without re-subscribing).
 * @param value - The value to track.
 * @returns A ref whose `.current` always holds the latest `value`.
 */
export default function useLatest<T>(value: T): MutableRefObject<T> {
  const ref = useRef<T>(value);
  ref.current = value;
  return ref;
}
