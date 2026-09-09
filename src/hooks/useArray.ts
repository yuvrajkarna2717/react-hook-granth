import { useCallback, useMemo, useState } from 'react';

export interface UseArrayActions<T> {
  /** Replace the entire array. */
  set: (value: T[]) => void;
  /** Append one or more items. */
  push: (...items: T[]) => void;
  /** Remove the item at `index`. */
  removeAt: (index: number) => void;
  /** Replace the item at `index`. */
  updateAt: (index: number, item: T) => void;
  /** Insert an item at `index`. */
  insertAt: (index: number, item: T) => void;
  /** Keep only items matching the predicate. */
  filter: (predicate: (item: T, index: number) => boolean) => void;
  /** Empty the array. */
  clear: () => void;
}

export type UseArrayReturn<T> = [T[], UseArrayActions<T>];

/**
 * Manage an array as immutable state with common mutation helpers.
 * @param initialValue - Initial array (defaults to `[]`).
 * @returns `[array, { set, push, removeAt, updateAt, insertAt, filter, clear }]`.
 */
export default function useArray<T>(initialValue: T[] = []): UseArrayReturn<T> {
  const [array, setArray] = useState<T[]>(initialValue);

  const set = useCallback((value: T[]) => setArray(value), []);

  const push = useCallback((...items: T[]) => {
    setArray((prev) => [...prev, ...items]);
  }, []);

  const removeAt = useCallback((index: number) => {
    setArray((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateAt = useCallback((index: number, item: T) => {
    setArray((prev) =>
      prev.map((current, i) => (i === index ? item : current))
    );
  }, []);

  const insertAt = useCallback((index: number, item: T) => {
    setArray((prev) => {
      const next = prev.slice();
      next.splice(index, 0, item);
      return next;
    });
  }, []);

  const filter = useCallback(
    (predicate: (item: T, index: number) => boolean) => {
      setArray((prev) => prev.filter(predicate));
    },
    []
  );

  const clear = useCallback(() => setArray([]), []);

  const actions = useMemo(
    () => ({ set, push, removeAt, updateAt, insertAt, filter, clear }),
    [set, push, removeAt, updateAt, insertAt, filter, clear]
  );

  return [array, actions];
}
