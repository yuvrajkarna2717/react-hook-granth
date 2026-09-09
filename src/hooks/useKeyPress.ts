import { useEffect, useRef, RefObject } from 'react';

export interface UseKeyPressOptions {
  /** Which keyboard event to listen for. Default: `'keydown'`. */
  event?: 'keydown' | 'keyup';
  /** Target element (via ref). Defaults to `window`. */
  target?: RefObject<HTMLElement | null>;
}

/**
 * Call a handler when one of the specified keys is pressed.
 *
 * Keys are matched against `KeyboardEvent.key` (e.g. `'Escape'`, `'Enter'`,
 * `'a'`). Pass a single key or an array of keys.
 * @param keys - Key or keys to match.
 * @param handler - Called with the matching `KeyboardEvent`.
 * @param options - `event` type and optional `target` element.
 */
export default function useKeyPress(
  keys: string | string[],
  handler: (event: KeyboardEvent) => void,
  options: UseKeyPressOptions = {}
): void {
  const { event = 'keydown', target } = options;

  const handlerRef = useRef(handler);
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  const keyList = Array.isArray(keys) ? keys : [keys];
  // Serialize for a stable effect dependency.
  const keyKey = keyList.join(',');

  useEffect(() => {
    const node: EventTarget | null = target
      ? target.current
      : typeof window !== 'undefined'
        ? window
        : null;

    if (!node) return;

    const listener = (e: Event) => {
      const keyboardEvent = e as KeyboardEvent;
      if (keyList.indexOf(keyboardEvent.key) !== -1) {
        handlerRef.current(keyboardEvent);
      }
    };

    node.addEventListener(event, listener);
    return () => node.removeEventListener(event, listener);
    // `keyList` is represented by `keyKey`; handler is read from the ref.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, target, keyKey]);
}
