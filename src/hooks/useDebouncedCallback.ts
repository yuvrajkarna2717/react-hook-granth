import { useCallback, useEffect, useMemo, useRef } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunction = (...args: any[]) => any;

export interface DebouncedCallback<T extends AnyFunction> {
  (...args: Parameters<T>): void;
  /** Cancel a pending invocation. */
  cancel: () => void;
  /** Invoke immediately with the most recent arguments, if pending. */
  flush: () => void;
}

/**
 * Debounce a callback: it runs only after `delay` ms have passed without a new
 * call, always using the most recent arguments.
 *
 * Complements `useDebounce` (which debounces a value) — use this for event
 * handlers, autosave, or API calls. Cleans up any pending call on unmount.
 * @param callback - The function to debounce.
 * @param delay - Debounce delay in milliseconds.
 * @returns A debounced function with `cancel` and `flush` methods.
 */
export default function useDebouncedCallback<T extends AnyFunction>(
  callback: T,
  delay: number
): DebouncedCallback<T> {
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastArgsRef = useRef<Parameters<T> | null>(null);

  const clear = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => clear, [clear]);

  const debounced = useCallback(
    (...args: Parameters<T>) => {
      lastArgsRef.current = args;
      clear();
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
        callbackRef.current(...(lastArgsRef.current as Parameters<T>));
      }, delay);
    },
    [delay, clear]
  );

  const cancel = useCallback(() => {
    clear();
    lastArgsRef.current = null;
  }, [clear]);

  const flush = useCallback(() => {
    if (timeoutRef.current && lastArgsRef.current) {
      clear();
      callbackRef.current(...lastArgsRef.current);
    }
  }, [clear]);

  return useMemo(() => {
    const fn = debounced as DebouncedCallback<T>;
    fn.cancel = cancel;
    fn.flush = flush;
    return fn;
  }, [debounced, cancel, flush]);
}
