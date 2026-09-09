import { useLayoutEffect, useEffect } from 'react';

// useLayoutEffect warns during SSR; fall back to useEffect on the server.
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Prevent scrolling of the document body while `locked` is true, restoring the
 * previous `overflow` value on unlock/unmount. Useful for modals and drawers.
 * @param locked - Whether the body scroll should be locked (defaults to `true`).
 */
export default function useLockBodyScroll(locked = true): void {
  useIsomorphicLayoutEffect(() => {
    if (!locked || typeof document === 'undefined') return;

    const { body } = document;
    const original = body.style.overflow;
    body.style.overflow = 'hidden';

    return () => {
      body.style.overflow = original;
    };
  }, [locked]);
}
