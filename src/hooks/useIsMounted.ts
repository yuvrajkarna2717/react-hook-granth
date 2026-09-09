import { useCallback, useEffect, useRef } from 'react';

/**
 * Track whether the component is currently mounted.
 *
 * Returns a stable getter you can call before a state update that follows an
 * async operation, to avoid updating state on an unmounted component.
 * @returns A function that returns `true` while the component is mounted.
 */
export default function useIsMounted(): () => boolean {
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return useCallback(() => mountedRef.current, []);
}
