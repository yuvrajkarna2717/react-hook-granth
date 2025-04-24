import { useEffect, useState } from "react";

/**
 * Track the scroll position of the window.
 * @returns {{ x: number, y: number }} - The current scroll position (x, y).
 */
export default function useScrollPosition() {
  const [position, setPosition] = useState({ x: window.scrollX, y: window.scrollY });

  useEffect(() => {
    const handleScroll = () => {
      setPosition({ x: window.scrollX, y: window.scrollY });
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return position;
}
