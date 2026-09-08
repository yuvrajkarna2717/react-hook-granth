import { useState, useCallback } from 'react';

export interface UseCounterReturn {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

/**
 * Manage a numeric counter with increment, decrement, and reset.
 * @param initialValue - Starting value (defaults to 0). `null`/`undefined` are treated as 0.
 * @returns The current count and stable increment/decrement/reset callbacks.
 */
const useCounter = (initialValue?: number | null): UseCounterReturn => {
  const normalizedInitialValue = initialValue ?? 0;
  const [count, setCount] = useState<number>(normalizedInitialValue);

  const increment = useCallback(() => setCount((prev) => prev + 1), []);
  const decrement = useCallback(() => setCount((prev) => prev - 1), []);
  const reset = useCallback(
    () => setCount(normalizedInitialValue),
    [normalizedInitialValue]
  );

  return { count, increment, decrement, reset };
};

export default useCounter;
