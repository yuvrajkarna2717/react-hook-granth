import { useEffect, useRef, RefObject } from 'react';

/**
 * Detect clicks (and touches) outside of a target element.
 * @param handler - Called when a click/touch occurs outside the element.
 * @returns A ref to attach to the target element.
 */
function useClickOutside<T extends HTMLElement = HTMLElement>(
  handler: (event: MouseEvent | TouchEvent) => void
): RefObject<T | null> {
  const ref = useRef<T>(null);

  // Keep the latest handler in a ref so we don't re-attach listeners on every
  // render when callers pass an inline function.
  const handlerRef = useRef(handler);
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent): void => {
      const target = event.target;
      if (
        !ref.current ||
        !target ||
        !(target instanceof Node) ||
        ref.current.contains(target)
      ) {
        return;
      }
      handlerRef.current(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, []);

  return ref;
}

export default useClickOutside;
