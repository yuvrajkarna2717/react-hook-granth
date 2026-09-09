import { useEffect, useRef, EffectCallback, DependencyList } from 'react';

/**
 * Like `useEffect`, but skips the effect on the initial mount and only runs it
 * on subsequent dependency updates.
 * @param effect - Effect callback (may return a cleanup function).
 * @param deps - Dependency list.
 */
export default function useUpdateEffect(
  effect: EffectCallback,
  deps?: DependencyList
): void {
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    return effect();
    // Mirror useEffect's dependency behavior.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
