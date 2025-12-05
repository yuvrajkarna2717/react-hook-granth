import { useEffect, useRef } from 'react';

/**
 * Hook to detect clicks outside of a specified element.
 * @param handler - Callback to run on outside click.
 * @returns Ref to attach to your target element.
 */
function useClickOutside<T extends HTMLElement = HTMLElement>(
  handler: (event: Event) => void
): React.RefObject<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const listener = (event: Event) => {
      // Type guard to ensure event.target exists and is a Node
      if (
        !ref.current ||
        !event.target ||
        !(event.target instanceof Node) ||
        ref.current.contains(event.target)
      ) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [handler]);

  return ref;
}

export default useClickOutside;
