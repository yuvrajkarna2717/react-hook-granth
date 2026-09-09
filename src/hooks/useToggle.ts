import { useCallback, useMemo, useState } from 'react';

export interface UseToggleActions {
  /** Flip the current value. */
  toggle: () => void;
  /** Set the value to `true`. */
  setTrue: () => void;
  /** Set the value to `false`. */
  setFalse: () => void;
  /** Set the value explicitly. */
  set: (value: boolean) => void;
}

export type UseToggleReturn = [boolean, UseToggleActions];

/**
 * Manage a boolean with convenient toggle/set helpers.
 * @param initialValue - Starting value (defaults to `false`).
 * @returns `[value, { toggle, setTrue, setFalse, set }]` with stable actions.
 */
export default function useToggle(initialValue = false): UseToggleReturn {
  const [value, setValue] = useState<boolean>(initialValue);

  const toggle = useCallback(() => setValue((v) => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  const set = useCallback((v: boolean) => setValue(v), []);

  const actions = useMemo(
    () => ({ toggle, setTrue, setFalse, set }),
    [toggle, setTrue, setFalse, set]
  );

  return [value, actions];
}
