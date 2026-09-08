import {
  useState,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
} from 'react';

export type UseLocalStorageReturn<T> = [T, Dispatch<SetStateAction<T>>];

/**
 * Sync state with `localStorage`, SSR-safe.
 *
 * The setter accepts a value or an updater function, mirroring `useState`.
 * @param key - localStorage key
 * @param initialValue - Initial value used when nothing is stored or on read failure
 * @returns Tuple of `[storedValue, setStoredValue]`
 */
function useLocalStorage<T>(
  key: string,
  initialValue: T
): UseLocalStorageReturn<T> {
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.error(`useLocalStorage: error reading key "${key}"`, error);
      return initialValue;
    }
    // `initialValue` is intentionally read only for the first mount; including
    // it would reset the value whenever a new object/array literal is passed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`useLocalStorage: error writing key "${key}"`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;
