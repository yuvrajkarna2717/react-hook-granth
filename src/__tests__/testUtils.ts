import type { RefObject } from 'react';

/**
 * Assign to a ref's `current` in tests, where we intentionally simulate React
 * attaching a DOM node. Bypasses the readonly typing on `RefObject.current`.
 */
export function setRefCurrent<T>(
  ref: RefObject<T | null> | { current: T | null },
  value: T | null
): void {
  (ref as { current: T | null }).current = value;
}
