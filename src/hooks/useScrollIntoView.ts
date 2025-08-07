import { useEffect, useState, useRef, useCallback, useMemo, RefObject } from "react";

interface ScrollIntoViewOptions {
  behavior?: ScrollBehavior;
  block?: ScrollLogicalPosition;
  inline?: ScrollLogicalPosition;
}

interface ScrollError {
  message: string;
}

interface UseScrollIntoViewReturn {
  hasScrolled: boolean;
  error: ScrollError | null;
  scrollToElement: () => void;
}

/**
 * useScrollIntoView Hook
 *
 * This hook automatically scrolls an element into view when any specified trigger in an array changes.
 * It also provides manual control, improved error handling, and optimizations.
 *
 * @param ref - The React ref object pointing to the target element.
 * @param triggers - An array of state variables that trigger the scroll effect when any of them change.
 * @param delay - The delay (in milliseconds) before scrolling occurs.
 * @param options - ScrollIntoView options.
 * @param onScrollComplete - A callback function executed after scrolling is completed.
 *
 * @returns An object containing:
 *   - hasScrolled: Indicates whether the scrolling has completed.
 *   - error: An error object if the ref is invalid.
 *   - scrollToElement: A function to manually trigger scrolling.
 */
const useScrollIntoView = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  triggers: unknown[] = [],
  delay: number = 100,
  options: ScrollIntoViewOptions = { 
    behavior: "smooth", 
    block: "start", 
    inline: "nearest" 
  },
  onScrollComplete: () => void = () => {}
): UseScrollIntoViewReturn => {
  const [hasScrolled, setHasScrolled] = useState<boolean>(false);
  const [error, setError] = useState<ScrollError | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const validateRef = useCallback((): ScrollError | null => {
    if (!ref || !ref.current) {
      return { message: "Invalid ref provided or element not found." };
    }
    if (!(ref.current instanceof HTMLElement)) {
      return { message: "Ref is not attached to a valid DOM element." };
    }
    return null;
  }, [ref]);

  const scrollToElement = useCallback((): void => {
    const validationError = validateRef();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setHasScrolled(false);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      ref.current?.scrollIntoView(options);
      setHasScrolled(true);
      onScrollComplete();
    }, delay);
  }, [validateRef, delay, options, onScrollComplete, ref]);

  const triggerDeps = useMemo(() => [...triggers], [triggers]);

  useEffect(() => {
    if (!triggers.some(Boolean)) return;
    scrollToElement();
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, triggerDeps);

  return { hasScrolled, error, scrollToElement };
};

export default useScrollIntoView;
