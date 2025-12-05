import { useEffect, useState } from "react";

/**
 * Sync state with sessionStorage.
 * @param key - sessionStorage key
 * @param initialValue - Initial value
 * @returns Tuple of [value, setValue]
 */
export default function useSessionStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const getValue = (): T => {
    const stored = sessionStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  };

  const [value, setValue] = useState<T>(getValue);

  useEffect(() => {
    sessionStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}