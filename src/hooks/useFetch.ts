import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseFetchReturn<T> {
  data: T | undefined;
  error: Error | undefined;
  loading: boolean;
  /** Manually re-run the request. */
  refetch: () => void;
}

/**
 * Fetch JSON from a URL with loading/error/data state.
 *
 * Aborts the in-flight request on unmount or when the URL/options change, and
 * re-fetches automatically when the URL changes. Non-2xx responses reject with
 * an `Error`.
 * @param url - Request URL. Pass a falsy value to skip fetching.
 * @param options - Standard `fetch` options.
 * @returns `{ data, error, loading, refetch }`.
 */
export default function useFetch<T = unknown>(
  url: string | null | undefined,
  options?: RequestInit
): UseFetchReturn<T> {
  const [data, setData] = useState<T | undefined>(undefined);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(Boolean(url));

  // Serialize options so identity changes don't re-trigger unnecessarily.
  const optionsKey = options ? JSON.stringify(options) : '';
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const abortRef = useRef<AbortController | null>(null);
  // Bump to force a refetch.
  const [reloadToken, setReloadToken] = useState(0);

  const refetch = useCallback(() => setReloadToken((n) => n + 1), []);

  useEffect(() => {
    if (!url) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(undefined);

    fetch(url, { ...optionsRef.current, signal: controller.signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }
        return res.json() as Promise<T>;
      })
      .then((json) => {
        if (!controller.signal.aborted) {
          setData(json);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err : new Error(String(err)));
        setLoading(false);
      });

    return () => controller.abort();
    // optionsKey captures option changes; optionsRef holds the live value.
  }, [url, optionsKey, reloadToken]);

  return { data, error, loading, refetch };
}
