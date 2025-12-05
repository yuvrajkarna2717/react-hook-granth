import { useEffect, useState } from 'react';

interface ScrollPosition {
  x: number;
  y: number;
}

/**
 * Track the scroll position of the window.
 * @returns The current scroll position (x, y)
 */
export default function useScrollPosition(): ScrollPosition {
  const [position, setPosition] = useState<ScrollPosition>(() => {
    if (typeof window === 'undefined') {
      return { x: 0, y: 0 };
    }
    return {
      x: window.scrollX,
      y: window.scrollY,
    };
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleScroll = (): void => {
      setPosition({ x: window.scrollX, y: window.scrollY });
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return position;
}
