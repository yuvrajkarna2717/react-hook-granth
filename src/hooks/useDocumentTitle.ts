import { useEffect } from 'react';

/**
 * Set the document title dynamically.
 * @param title - The title to set for the document.
 */
export default function useDocumentTitle(title: string): void {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
