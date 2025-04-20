import { useEffect, useState } from "react";

/**
 * Custom hook to match a CSS media query.
 * @param {string} query - The media query string.
 * @returns {boolean} - Whether the query currently matches.
 */
export default function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);

    const listener = (event) => setMatches(event.matches);
    mediaQueryList.addEventListener("change", listener);

    // Initial check
    setMatches(mediaQueryList.matches);

    return () => {
      mediaQueryList.removeEventListener("change", listener);
    };
  }, [query]);

  return matches;
}
