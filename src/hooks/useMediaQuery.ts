import { useEffect, useState } from "react";

/**
 * Custom hook to match a CSS media query.
 * @param query - The media query string
 * @returns Whether the query currently matches
 */
export default function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    
    const mediaQueryList = window.matchMedia(query);

    const listener = (event: MediaQueryListEvent): void => setMatches(event.matches);
    mediaQueryList.addEventListener("change", listener);

    // Initial check
    setMatches(mediaQueryList.matches);

    return () => {
      mediaQueryList.removeEventListener("change", listener);
    };
  }, [query]);

  return matches;
}