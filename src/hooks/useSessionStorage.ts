import {
  useEffect,
  useState,
  useCallback,
  Dispatch,
  SetStateAction,
} from 'react';

export type UseSessionStorageReturn<T> = [T, Dispatch<SetStateAction<T>>];

/**
 * Sync state with `sessionStorage`, SSR-safe.
 *
 * The setter accepts a value or an updater function, mirroring `useState`.
 * @param key - sessionStorage key
 * @param initialValue - Initial value used when nothing is stored or on read failure
 * @returns Tuple of `[value, setValue]`
 */
function useSessionStorage<T>(
  key: string,
  initialValue: T
): UseSessionStorageReturn<T> {
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const stored = window.sessionStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : initialValue;
    } catch (error) {
      console.error(`useSessionStorage: error reading key "${key}"`, error);
      return initialValue;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const [value, setValue] = useState<T>(readValue);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`useSessionStorage: error writing key "${key}"`, error);
    }
  }, [key, value]);

  return [value, setValue];
}

export default useSessionStorage;
