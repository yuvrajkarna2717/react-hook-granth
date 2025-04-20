import { useState } from "react";

/**
 * Custom hook to copy text to clipboard.
 * @returns {[boolean, (text: string) => Promise<void>]} - [isCopied, copy]
 */
function useCopyToClipboard() {
  const [isCopied, setIsCopied] = useState(false);

  const copy = async (text) => {
    if (!navigator?.clipboard) {
      console.warn("Clipboard API not supported");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);

      setTimeout(() => setIsCopied(false), 2000); // Reset after 2s
    } catch (error) {
      console.error("Copy failed:", error);
      setIsCopied(false);
    }
  };

  return [isCopied, copy];
}

export default useCopyToClipboard;