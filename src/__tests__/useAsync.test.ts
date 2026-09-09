import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import useAsync from '../hooks/useAsync';

describe('useAsync', () => {
  it('runs immediately by default and resolves to success', async () => {
    const fn = vi.fn().mockResolvedValue('done');
    const { result } = renderHook(() => useAsync(fn));

    // Pending right after mount.
    expect(result.current.status).toBe('pending');
    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.status).toBe('success'));
    expect(result.current.data).toBe('done');
    expect(result.current.error).toBeUndefined();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('does not run immediately when immediate is false', () => {
    const fn = vi.fn().mockResolvedValue('x');
    const { result } = renderHook(() => useAsync(fn, false));

    expect(result.current.status).toBe('idle');
    expect(fn).not.toHaveBeenCalled();
  });

  it('captures errors and sets error status', async () => {
    const err = new Error('boom');
    const fn = vi.fn().mockRejectedValue(err);
    const { result } = renderHook(() => useAsync(fn));

    await waitFor(() => expect(result.current.status).toBe('error'));
    expect(result.current.error).toBe(err);
    expect(result.current.data).toBeUndefined();
  });

  it('execute resolves with the result and accepts arguments', async () => {
    const fn = vi.fn((n: number) => Promise.resolve(n * 2));
    const { result } = renderHook(() => useAsync(fn, false));

    let value: number | undefined;
    await act(async () => {
      value = await result.current.execute(21);
    });
    expect(value).toBe(42);
    expect(result.current.data).toBe(42);
  });

  it('commits only the latest call (race protection)', async () => {
    let resolveFirst!: (v: string) => void;
    const first = new Promise<string>((r) => {
      resolveFirst = r;
    });
    const second = Promise.resolve('second');
    const fn = vi
      .fn()
      .mockImplementationOnce(() => first)
      .mockImplementationOnce(() => second) as () => Promise<string>;

    const { result } = renderHook(() => useAsync(fn, false));

    await act(async () => {
      result.current.execute(); // starts first (pending)
      await result.current.execute(); // starts + resolves second
    });

    // Resolve the stale first call last; it must NOT overwrite state.
    await act(async () => {
      resolveFirst('first');
      await first;
    });

    expect(result.current.data).toBe('second');
  });

  it('does not update state after unmount', async () => {
    let resolveFn!: (v: string) => void;
    const fn = vi.fn(
      () =>
        new Promise<string>((r) => {
          resolveFn = r;
        })
    );
    const { result, unmount } = renderHook(() => useAsync(fn, false));

    let execPromise!: Promise<string>;
    act(() => {
      execPromise = result.current.execute();
    });
    unmount();

    // Resolving after unmount must not throw or warn.
    await act(async () => {
      resolveFn('late');
      await execPromise;
    });
    // Nothing to assert on state (unmounted); the test passes if no error.
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
