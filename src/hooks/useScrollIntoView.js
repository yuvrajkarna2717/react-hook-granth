/**
 * useScrollIntoView Hook
 *
 * This hook automatically scrolls an element into view when any specified trigger in an array changes.
 * It also provides manual control, improved error handling, and optimizations.
 *
 * @param {Object} ref - The React ref object pointing to the target element.
 * @param {Array} triggers - An array of state variables that trigger the scroll effect when any of them change.
 * @param {number} [delay=100] - The delay (in milliseconds) before scrolling occurs.
 * @param {Object} [options={ behavior: "smooth", block: "start", inline: "nearest" }] - ScrollIntoView options.
 * @param {Function} [onScrollComplete] - A callback function executed after scrolling is completed.
 *
 * @returns {Object} - An object containing:
 *   - hasScrolled {boolean}: Indicates whether the scrolling has completed.
 *   - error {Object | null}: An error object if the ref is invalid.
 *   - scrollToElement {Function}: A function to manually trigger scrolling.
 *
 * @usage
 * ```javascript
 * const questionRef = useRef(null);
 * const [shouldScroll, setShouldScroll] = useState(false);
 *
 * const { hasScrolled, error, scrollToElement } = useScrollIntoView(
 *   questionRef,
 *   [shouldScroll],
 *   200,
 *   { behavior: "smooth", block: "center" },
 *   () => console.log("Scrolling completed!")
 * );
 *
 * return (
 *   <button onClick={() => setShouldScroll(prev => !prev)}>Scroll</button>
 *   <button onClick={scrollToElement}>Manual Scroll</button>
 *   {error && <p>Error: {error.message}</p>}
 *   <div ref={questionRef}>Scroll to me! {hasScrolled ? "✅" : "⌛"}</div>
 * );
 * ```
 *
 * This hook is useful for scenarios where a UI element needs to be brought into view dynamically,
 * such as navigating to a specific section of a page or focusing on an error message.
 */
import { useEffect, useState, useRef, useCallback, useMemo } from "react";

const useScrollIntoView = (
  ref,
  triggers = [],
  delay = 100,
  options = { behavior: "smooth", block: "start", inline: "nearest" },
  onScrollComplete = () => {}
) => {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [error, setError] = useState(null);
  const timeoutRef = useRef(null);

  const validateRef = useCallback(() => {
    if (!ref || !ref.current) {
      return { message: "Invalid ref provided or element not found." };
    }
    if (!(ref.current instanceof HTMLElement)) {
      return { message: "Ref is not attached to a valid DOM element." };
    }
    return null;
  }, [ref]);

  const scrollToElement = useCallback(() => {
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
      ref.current.scrollIntoView(options);
      setHasScrolled(true);
      onScrollComplete();
    }, delay);
  }, [validateRef, delay, options, onScrollComplete]);

  const triggerDeps = useMemo(() => [...triggers], [triggers]);

  useEffect(() => {
    if (!triggers.some(Boolean)) return;
    scrollToElement();
    return () => clearTimeout(timeoutRef.current);
  }, triggerDeps);

  return { hasScrolled, error, scrollToElement };
};

export default useScrollIntoView;
