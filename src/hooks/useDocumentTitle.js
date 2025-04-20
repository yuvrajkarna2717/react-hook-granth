import { useEffect } from "react";

/**
 * Set the document title dynamically.
 * @param {string} title - The title to set for the document.
 */
export default function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
