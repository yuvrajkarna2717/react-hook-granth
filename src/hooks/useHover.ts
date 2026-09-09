import { useCallback, useEffect, useRef, useState, RefObject } from 'react';

export type UseHoverReturn<T extends HTMLElement> = [
  RefObject<T | null>,
  boolean,
];

/**
 * Track whether the pointer is hovering a target element.
 * @returns `[ref, isHovered]` — attach `ref` to the element to observe.
 */
export default function useHover<
  T extends HTMLElement = HTMLElement,
>(): UseHoverReturn<T> {
  const ref = useRef<T>(null);
  const [hovered, setHovered] = useState(false);

  const handleEnter = useCallback(() => setHovered(true), []);
  const handleLeave = useCallback(() => setHovered(false), []);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    node.addEventListener('mouseenter', handleEnter);
    node.addEventListener('mouseleave', handleLeave);

    return () => {
      node.removeEventListener('mouseenter', handleEnter);
      node.removeEventListener('mouseleave', handleLeave);
    };
    // Re-bind if the element instance changes.
  }, [handleEnter, handleLeave]);

  return [ref, hovered];
}
