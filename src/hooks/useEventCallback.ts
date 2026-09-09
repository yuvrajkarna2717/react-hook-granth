import { useCallback, useEffect, useRef } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunction = (...args: any[]) => any;

/**
 * Return a stable callback identity that always invokes the latest `fn`.
 *
 * The returned function never changes across renders, so it is safe to pass to
 * memoized children, effects, or event subscriptions without causing
 * re-subscriptions, while still calling the most recent closure (no stale
 * values).
 * @param fn - The callback to wrap.
 * @returns A memoized function with a stable identity.
 */
export default function useEventCallback<T extends AnyFunction>(fn: T): T {
  const ref = useRef<T>(fn);

  useEffect(() => {
    ref.current = fn;
  }, [fn]);

  return useCallback(
    (...args: Parameters<T>): ReturnType<T> => ref.current(...args),
    []
  ) as T;
}
