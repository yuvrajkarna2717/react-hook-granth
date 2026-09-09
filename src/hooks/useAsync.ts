import { useCallback, useEffect, useRef, useState } from 'react';

export type AsyncStatus = 'idle' | 'pending' | 'success' | 'error';

export interface UseAsyncReturn<T, Args extends unknown[]> {
  /** Run the async function; resolves with the result or rejects on error. */
  execute: (...args: Args) => Promise<T>;
  status: AsyncStatus;
  data: T | undefined;
  error: Error | undefined;
  /** Convenience flag: `status === 'pending'`. */
  isLoading: boolean;
}

/**
 * Run an async function and track its status, result, and error.
 *
 * Guards against state updates after unmount and against race conditions
 * (only the most recent call's result is committed).
 * @param asyncFn - The async function to run.
 * @param immediate - Run once on mount (default `true`). Only applies when the
 *   function takes no arguments.
 * @returns `{ execute, status, data, error, isLoading }`.
 */
export default function useAsync<T, Args extends unknown[] = []>(
  asyncFn: (...args: Args) => Promise<T>,
  immediate = true
): UseAsyncReturn<T, Args> {
  const [status, setStatus] = useState<AsyncStatus>('idle');
  const [data, setData] = useState<T | undefined>(undefined);
  const [error, setError] = useState<Error | undefined>(undefined);

  const mountedRef = useRef(false);
  // Monotonically increasing id; only the latest run may commit state.
  const callIdRef = useRef(0);
  const asyncFnRef = useRef(asyncFn);
  useEffect(() => {
    asyncFnRef.current = asyncFn;
  }, [asyncFn]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const execute = useCallback((...args: Args): Promise<T> => {
    const callId = ++callIdRef.current;
    setStatus('pending');
    setData(undefined);
    setError(undefined);

    return asyncFnRef.current(...args).then(
      (result) => {
        if (mountedRef.current && callId === callIdRef.current) {
          setData(result);
          setStatus('success');
        }
        return result;
      },
      (err: unknown) => {
        const normalized = err instanceof Error ? err : new Error(String(err));
        if (mountedRef.current && callId === callIdRef.current) {
          setError(normalized);
          setStatus('error');
        }
        throw normalized;
      }
    );
  }, []);

  useEffect(() => {
    if (immediate) {
      // Only auto-run for zero-arg functions; ignore rejections here.
      (execute as () => Promise<T>)().catch(() => {});
    }
    // Run once on mount when `immediate` is set.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { execute, status, data, error, isLoading: status === 'pending' };
}
