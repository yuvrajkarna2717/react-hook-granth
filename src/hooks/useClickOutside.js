import { useEffect, useRef } from "react";

/**
 * Hook to detect clicks outside of a specified element.
 * @param {Function} handler - Callback to run on outside click.
 * @returns {React.RefObject} - Ref to attach to your target element.
 */
function useClickOutside(handler) {
  const ref = useRef(null);

  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [handler]);

  return ref;
}

export default useClickOutside
