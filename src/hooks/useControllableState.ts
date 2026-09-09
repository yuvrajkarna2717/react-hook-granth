import { useCallback, useRef, useState, Dispatch, SetStateAction } from 'react';

export interface UseControllableStateParams<T> {
  /** Controlled value. When provided (not `undefined`), the hook is controlled. */
  value?: T;
  /** Initial value used in uncontrolled mode. */
  defaultValue: T;
  /** Called whenever the value should change (both modes). */
  onChange?: (value: T) => void;
}

export type UseControllableStateReturn<T> = [T, Dispatch<SetStateAction<T>>];

/**
 * State that can be either controlled (via `value`) or uncontrolled (internal),
 * the standard pattern for building reusable components.
 *
 * When `value` is provided the hook is controlled and only calls `onChange`;
 * otherwise it manages internal state and still calls `onChange`.
 * @returns `[value, setValue]`, where `setValue` accepts a value or updater.
 */
export default function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: UseControllableStateParams<T>): UseControllableStateReturn<T> {
  const [uncontrolled, setUncontrolled] = useState<T>(defaultValue);
  const isControlled = value !== undefined;

  // Keep the latest controlled value/handler for the updater path.
  const valueRef = useRef(value);
  valueRef.current = value;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const current = isControlled ? (value as T) : uncontrolled;
  const currentRef = useRef(current);
  currentRef.current = current;

  const setValue = useCallback<Dispatch<SetStateAction<T>>>((next) => {
    const resolved =
      typeof next === 'function'
        ? (next as (prev: T) => T)(currentRef.current)
        : next;

    // Only own internal state when uncontrolled.
    if (valueRef.current === undefined) {
      setUncontrolled(resolved);
    }
    onChangeRef.current?.(resolved);
  }, []);

  return [current, setValue];
}
