import { useEffect, useState } from 'react';

/**
 * Detect if user is idle after a given timeout.
 * @param timeout - Timeout in milliseconds (default: 3000)
 * @returns True if user is idle
 */
export default function useIdle(timeout: number = 3000): boolean {
  const [idle, setIdle] = useState<boolean>(false);

  useEffect(() => {
    let timer: number | null = null;

    const reset = (): void => {
      if (timer) clearTimeout(timer);
      setIdle(false);
      timer = setTimeout(() => setIdle(true), timeout);
    };

    const events = [
      'mousemove',
      'mousedown',
      'keydown',
      'scroll',
      'touchstart',
    ];

    events.forEach((e) => window.addEventListener(e, reset));

    reset(); // start the timer

    return () => {
      if (timer) clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, reset));
    };
  }, [timeout]);

  return idle;
}
