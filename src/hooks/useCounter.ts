import { useState, useCallback } from "react";

const useCounter = (initialValue?: number | null) => {
  const normalizedInitialValue = initialValue ?? 0;
  const [count, setCount] = useState<number>(normalizedInitialValue);

  const increment = useCallback(() => setCount((prev) => prev + 1), []);
  const decrement = useCallback(() => setCount((prev) => prev - 1), []);
  const reset = useCallback(() => setCount(normalizedInitialValue), [normalizedInitialValue]);

  return { count, increment, decrement, reset };
};

export default useCounter;
