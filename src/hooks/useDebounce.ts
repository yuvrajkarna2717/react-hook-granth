// src/hooks/useDebounce.ts
import { useEffect, useState, useRef, useCallback } from 'react';

export interface UseDebounceOptions<T> {
  /** Fire on the leading edge of the timeout. Default: false. */
  leading?: boolean;
  /** Fire on the trailing edge of the timeout. Default: true. */
  trailing?: boolean;
  /** Maximum time the value is allowed to be delayed before it is forced through. */
  maxWait?: number;
  /** Called when the debounced value is committed. */
  onDebounce?: (value: T) => void;
  /** Called when a pending debounce is cancelled. */
  onCancel?: () => void;
}

export interface UseDebounceReturn<T> {
  debouncedValue: T;
  cancel: () => void;
  flush: () => void;
  isPending: boolean;
}

export default function useDebounce<T>(
  value: T,
  delay: number = 300,
  options: UseDebounceOptions<T> = {}
): UseDebounceReturn<T> {
  const { leading = false, trailing = true, maxWait } = options;

  // Keep callbacks in refs so effects don't need them as dependencies
  // (prevents stale closures without re-running the debounce effect).
  const onDebounceRef = useRef(options.onDebounce);
  const onCancelRef = useRef(options.onCancel);
  useEffect(() => {
    onDebounceRef.current = options.onDebounce;
    onCancelRef.current = options.onCancel;
  }, [options.onDebounce, options.onCancel]);

  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const [isPending, setIsPending] = useState<boolean>(false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const maxTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousValueRef = useRef<T>(value);
  const leadingCalledRef = useRef<boolean>(false);
  const maxWaitStartTimeRef = useRef<number | null>(null);
  // Always holds the most recent value so the maxWait timer (scheduled once at
  // the start of a burst) commits the latest value rather than a stale one.
  const latestValueRef = useRef<T>(value);
  latestValueRef.current = value;

  const clearTimeouts = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (maxTimeoutRef.current) {
      clearTimeout(maxTimeoutRef.current);
      maxTimeoutRef.current = null;
    }
  }, []);

  const updateValue = useCallback(
    (
      newValue: T,
      source: 'debounce' | 'flush' | 'leading' | 'maxwait' = 'debounce'
    ) => {
      setDebouncedValue(newValue);
      setIsPending(false);
      clearTimeouts();

      if (source === 'debounce' || source === 'maxwait') {
        onDebounceRef.current?.(newValue);
      }

      previousValueRef.current = newValue;
      leadingCalledRef.current = false;
      maxWaitStartTimeRef.current = null;
    },
    [clearTimeouts]
  );

  const cancel = useCallback(() => {
    clearTimeouts();
    setIsPending(false);
    leadingCalledRef.current = false;
    maxWaitStartTimeRef.current = null;
    onCancelRef.current?.();
  }, [clearTimeouts]);

  const flush = useCallback(() => {
    if (isPending && timeoutRef.current) {
      updateValue(value, 'flush');
    }
  }, [isPending, value, updateValue]);

  useEffect(() => {
    // If value hasn't changed, do nothing
    if (Object.is(previousValueRef.current, value)) {
      return;
    }

    // Initialize maxWait start time on first change in sequence
    if (maxWaitStartTimeRef.current === null) {
      maxWaitStartTimeRef.current = Date.now();
    }

    // Clear existing regular timeout (but preserve maxTimeout logic)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Leading edge execution
    if (leading && !leadingCalledRef.current) {
      setDebouncedValue(value);
      leadingCalledRef.current = true;

      if (!trailing) {
        // Leading only - no pending state
        setIsPending(false);
        previousValueRef.current = value;
        onDebounceRef.current?.(value);
        maxWaitStartTimeRef.current = null;
        return;
      } else {
        // Leading + trailing - still pending for trailing execution
        setIsPending(true);
      }
    } else {
      setIsPending(true);
    }

    // Set up trailing edge execution
    if (trailing) {
      timeoutRef.current = setTimeout(() => {
        updateValue(value, 'debounce');
      }, delay);
    }

    // Set up max wait timeout (only if not already set)
    if (maxWait && !maxTimeoutRef.current) {
      const elapsed = Date.now() - (maxWaitStartTimeRef.current || 0);
      const remainingMaxWait = maxWait - elapsed;

      if (remainingMaxWait <= 0) {
        // MaxWait time has already passed, execute immediately
        updateValue(value, 'maxwait');
        return;
      }

      // Commit the latest value when maxWait elapses, not the value captured
      // when the timer was scheduled.
      maxTimeoutRef.current = setTimeout(() => {
        updateValue(latestValueRef.current, 'maxwait');
      }, remainingMaxWait);
    }
  }, [value, delay, leading, trailing, maxWait, updateValue]);

  // Reset leading flag when timing options change
  useEffect(() => {
    leadingCalledRef.current = false;
    maxWaitStartTimeRef.current = null;
  }, [leading, trailing, delay]);

  // Clean up any pending timers on unmount.
  useEffect(() => clearTimeouts, [clearTimeouts]);

  return {
    debouncedValue,
    cancel,
    flush,
    isPending,
  };
}
