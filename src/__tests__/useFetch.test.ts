import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import useFetch from '../hooks/useFetch';

const okResponse = (data: unknown) => ({
  ok: true,
  status: 200,
  json: () => Promise.resolve(data),
});

afterEach(() => {
  vi.restoreAllMocks();
  delete (globalThis as { fetch?: unknown }).fetch;
});

describe('useFetch', () => {
  it('loads and returns data', async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValue(okResponse({ id: 1 })) as unknown as typeof fetch;

    const { result } = renderHook(() => useFetch<{ id: number }>('/api/x'));
    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toEqual({ id: 1 });
    expect(result.current.error).toBeUndefined();
  });

  it('sets an error on non-2xx responses', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({}),
    }) as unknown as typeof fetch;

    const { result } = renderHook(() => useFetch('/api/fail'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.data).toBeUndefined();
  });

  it('does not fetch when url is falsy', () => {
    const fetchMock = vi.fn();
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const { result } = renderHook(() => useFetch(null));
    expect(result.current.loading).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('refetches when refetch is called', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(okResponse({ n: 1 })) as unknown as typeof fetch;
    globalThis.fetch = fetchMock;

    const { result } = renderHook(() => useFetch('/api/x'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(
      fetchMock as unknown as ReturnType<typeof vi.fn>
    ).toHaveBeenCalledTimes(1);

    act(() => result.current.refetch());
    await waitFor(() =>
      expect(
        fetchMock as unknown as ReturnType<typeof vi.fn>
      ).toHaveBeenCalledTimes(2)
    );
  });

  it('refetches when the url changes', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(okResponse({})) as unknown as typeof fetch;
    globalThis.fetch = fetchMock;

    const { rerender } = renderHook(({ url }) => useFetch(url), {
      initialProps: { url: '/api/a' },
    });
    await waitFor(() =>
      expect(
        fetchMock as unknown as ReturnType<typeof vi.fn>
      ).toHaveBeenCalledTimes(1)
    );

    rerender({ url: '/api/b' });
    await waitFor(() =>
      expect(
        fetchMock as unknown as ReturnType<typeof vi.fn>
      ).toHaveBeenCalledTimes(2)
    );
  });

  it('aborts the request on unmount', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(okResponse({})) as unknown as typeof fetch;
    globalThis.fetch = fetchMock;

    const { unmount } = renderHook(() => useFetch('/api/x'));
    // Should not throw when aborting an in-flight request.
    expect(() => unmount()).not.toThrow();
  });
});
