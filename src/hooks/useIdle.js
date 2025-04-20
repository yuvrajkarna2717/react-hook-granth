import { useEffect, useState } from "react";

/**
 * Detect if user is idle after a given timeout.
 * @param {number} timeout - in milliseconds
 * @returns {boolean} - true if idle
 */
export default function useIdle(timeout = 3000) {
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    let timer = null;

    const reset = () => {
      clearTimeout(timer);
      setIdle(false);
      timer = setTimeout(() => setIdle(true), timeout);
    };

    const events = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"];

    events.forEach((e) => window.addEventListener(e, reset));

    reset(); // start the timer

    return () => {
      clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, reset));
    };
  }, [timeout]);

  return idle;
}
