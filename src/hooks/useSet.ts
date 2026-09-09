import { useCallback, useMemo, useState } from 'react';

export interface UseSetActions<T> {
  add: (item: T) => void;
  remove: (item: T) => void;
  toggle: (item: T) => void;
  has: (item: T) => boolean;
  clear: () => void;
  reset: () => void;
}

export type UseSetReturn<T> = [Set<T>, UseSetActions<T>];

/**
 * Manage a `Set` as immutable state with convenient actions.
 *
 * Every mutating action produces a new `Set` so React re-renders correctly.
 * @param initialValue - Initial items (array or `Set`).
 * @returns `[set, { add, remove, toggle, has, clear, reset }]`.
 */
export default function useSet<T>(initialValue?: Iterable<T>): UseSetReturn<T> {
  const getInitial = useCallback(
    () => new Set<T>(initialValue),
    // Only used to seed initial state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [set, setSet] = useState<Set<T>>(getInitial);

  const add = useCallback((item: T) => {
    setSet((prev) => {
      if (prev.has(item)) return prev;
      const next = new Set(prev);
      next.add(item);
      return next;
    });
  }, []);

  const remove = useCallback((item: T) => {
    setSet((prev) => {
      if (!prev.has(item)) return prev;
      const next = new Set(prev);
      next.delete(item);
      return next;
    });
  }, []);

  const toggle = useCallback((item: T) => {
    setSet((prev) => {
      const next = new Set(prev);
      if (next.has(item)) next.delete(item);
      else next.add(item);
      return next;
    });
  }, []);

  const has = useCallback((item: T) => set.has(item), [set]);
  const clear = useCallback(() => setSet(new Set<T>()), []);
  const reset = useCallback(() => setSet(getInitial()), [getInitial]);

  const actions = useMemo(
    () => ({ add, remove, toggle, has, clear, reset }),
    [add, remove, toggle, has, clear, reset]
  );

  return [set, actions];
}
