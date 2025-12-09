import { useState, useCallback, useRef } from 'react';

interface UseCopyToClipboardOptions {
  resetTime?: number;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

interface UseCopyToClipboardReturn {
  isCopied: boolean;
  copy: (text: string) => Promise<boolean>;
  reset: () => void;
}

/**
 * Custom hook to copy text to clipboard with enhanced features.
 * @param options - Configuration options for the hook
 * @returns Object with isCopied state, copy function, and reset function
 */
function useCopyToClipboard(
  options: UseCopyToClipboardOptions = {}
): UseCopyToClipboardReturn {
  const { resetTime = 2000, onSuccess, onError } = options;
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const timeoutRef = useRef<number | null>(null);

  const reset = useCallback(() => {
    setIsCopied(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      if (!navigator?.clipboard) {
        const error = new Error('Clipboard API not supported');
        onError?.(error);
        return false;
      }

      try {
        await navigator.clipboard.writeText(text);
        setIsCopied(true);
        onSuccess?.();

        // Clear existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        // Set new timeout
        timeoutRef.current = setTimeout(() => {
          setIsCopied(false);
          timeoutRef.current = null;
        }, resetTime);

        return true;
      } catch (error) {
        const copyError =
          error instanceof Error ? error : new Error('Unknown error occurred');
        onError?.(copyError);
        setIsCopied(false);
        return false;
      }
    },
    [resetTime, onSuccess, onError]
  );

  return { isCopied, copy, reset };
}

export default useCopyToClipboard;
