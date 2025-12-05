// src/hooks/useDebounce.ts
import { useEffect, useState, useRef, useCallback } from 'react';

interface UseDebounceOptions {
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number;
  onDebounce?: (value: any) => void;
  onCancel?: () => void;
}

interface UseDebounceReturn<T> {
  debouncedValue: T;
  cancel: () => void;
  flush: () => void;
  isPending: boolean;
}

export default function useDebounce<T>(
  value: T,
  delay: number = 300,
  options: UseDebounceOptions = {}
): UseDebounceReturn<T> {
  const {
    leading = false,
    trailing = true,
    maxWait,
    onDebounce,
    onCancel,
  } = options;

  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const [isPending, setIsPending] = useState<boolean>(false);

  const timeoutRef = useRef<number | null>(null);
  const maxTimeoutRef = useRef<number | null>(null);
  const previousValueRef = useRef<T>(value);
  const leadingCalledRef = useRef<boolean>(false);
  const maxWaitStartTimeRef = useRef<number | null>(null); // Track when maxWait sequence started

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
        onDebounce?.(newValue);
      }

      previousValueRef.current = newValue;
      leadingCalledRef.current = false;
      maxWaitStartTimeRef.current = null; // Reset maxWait sequence
    },
    [onDebounce, clearTimeouts]
  );

  const cancel = useCallback(() => {
    clearTimeouts();
    setIsPending(false);
    leadingCalledRef.current = false;
    maxWaitStartTimeRef.current = null;
    onCancel?.();
  }, [clearTimeouts, onCancel]);

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
        onDebounce?.(value);
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

      maxTimeoutRef.current = setTimeout(() => {
        updateValue(value, 'maxwait');
      }, remainingMaxWait);
    }
  }, [value, delay, leading, trailing, maxWait, updateValue]);

  // Reset leading flag when options change
  useEffect(() => {
    leadingCalledRef.current = false;
    maxWaitStartTimeRef.current = null;
  }, [leading, trailing, delay]);

  return {
    debouncedValue,
    cancel,
    flush,
    isPending,
  };
}
