import { useEffect, useState, useRef, useCallback, RefObject } from 'react';

export interface ScrollIntoViewOptions {
  behavior?: ScrollBehavior;
  block?: ScrollLogicalPosition;
  inline?: ScrollLogicalPosition;
}

export interface ScrollError {
  message: string;
}

export interface UseScrollIntoViewReturn {
  hasScrolled: boolean;
  error: ScrollError | null;
  scrollToElement: () => void;
}

const DEFAULT_OPTIONS: ScrollIntoViewOptions = {
  behavior: 'smooth',
  block: 'start',
  inline: 'nearest',
};

/**
 * Scroll an element into view when any of the provided triggers change,
 * with manual control and error reporting.
 *
 * @param ref - Ref pointing to the target element.
 * @param triggers - Values that trigger a scroll when any of them change.
 * @param delay - Delay in milliseconds before scrolling.
 * @param options - `scrollIntoView` options.
 * @param onScrollComplete - Called after scrolling completes.
 * @returns `hasScrolled`, `error`, and a manual `scrollToElement` function.
 */
const useScrollIntoView = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null> | null,
  triggers: unknown[] = [],
  delay: number = 100,
  options: ScrollIntoViewOptions = DEFAULT_OPTIONS,
  onScrollComplete: () => void = () => {}
): UseScrollIntoViewReturn => {
  const [hasScrolled, setHasScrolled] = useState<boolean>(false);
  const [error, setError] = useState<ScrollError | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hold the latest options/callback in refs so `scrollToElement` stays stable
  // even when callers pass inline object/function literals.
  const optionsRef = useRef(options);
  const onScrollCompleteRef = useRef(onScrollComplete);
  useEffect(() => {
    optionsRef.current = options;
    onScrollCompleteRef.current = onScrollComplete;
  });

  const validateRef = useCallback((): ScrollError | null => {
    if (!ref || !ref.current) {
      return { message: 'Invalid ref provided or element not found.' };
    }
    if (!(ref.current instanceof HTMLElement)) {
      return { message: 'Ref is not attached to a valid DOM element.' };
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
      ref?.current?.scrollIntoView(optionsRef.current);
      setHasScrolled(true);
      onScrollCompleteRef.current();
    }, delay);
  }, [validateRef, delay, ref]);

  useEffect(() => {
    if (!triggers.some(Boolean)) return;
    scrollToElement();
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
    // Re-run when any trigger changes or the scroll routine changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollToElement, ...triggers]);

  // Ensure any pending timer is cleared on unmount.
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { hasScrolled, error, scrollToElement };
};

export default useScrollIntoView;
