import { renderHook, act } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { waitFor } from '@testing-library/react';

import useScrollIntoView from '../hooks/useScrollIntoView';

beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('useScrollIntoView Hook', () => {
  test('should not scroll if ref is invalid', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useScrollIntoView(null, [], 100));

    vi.runAllTimers();

    waitFor(() => {
      expect(result.current.error).toEqual({
        message: 'Invalid ref provided or element not found.',
      });
    });
    expect(result.current.hasScrolled).toBe(false);

    vi.useRealTimers();
  });

  test('should scroll when a trigger changes', async () => {
    vi.useFakeTimers();

    const ref = { current: document.createElement('div') };
    const { result, rerender } = renderHook(
      ({ triggers }) => useScrollIntoView(ref, triggers, 100),
      { initialProps: { triggers: [false] } }
    );
    waitFor(() => {
      expect(result.current.hasScrolled).toBe(false);
    });

    await act(async () => {
      rerender({ triggers: [true] });
    });
    vi.runAllTimers();
    waitFor(() => {
      expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalled();
    });

    vi.useRealTimers();
  });

  test('should manually scroll when scrollToElement is called', () => {
    vi.useFakeTimers();

    const ref = { current: document.createElement('div') };
    const { result } = renderHook(() => useScrollIntoView(ref, [], 100));

    act(() => {
      result.current.scrollToElement();
    });

    vi.runAllTimers();

    expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalled();
    vi.useRealTimers();
  });

  test('should execute onScrollComplete callback after scrolling', async () => {
    vi.useFakeTimers();

    const ref = { current: document.createElement('div') };
    const onScrollComplete = vi.fn();

    const { result } = renderHook(() =>
      useScrollIntoView(ref, [], 100, {}, onScrollComplete)
    );

    await act(async () => {
      result.current.scrollToElement();
    });
    vi.runAllTimers();

    expect(onScrollComplete).toHaveBeenCalledTimes(1);

    await act(async () => {
      result.current.scrollToElement();
    });
    vi.runAllTimers();

    expect(onScrollComplete).toHaveBeenCalledTimes(2);

    vi.useRealTimers();
  });

  test('should set an error when the ref points to a non-DOM element', () => {
    // ref.current exists but is not an HTMLElement.
    const ref = { current: {} } as unknown as React.RefObject<HTMLElement>;
    const { result } = renderHook(() => useScrollIntoView(ref, [], 100));

    act(() => {
      result.current.scrollToElement();
    });

    expect(result.current.error).toEqual({
      message: 'Ref is not attached to a valid DOM element.',
    });
    expect(result.current.hasScrolled).toBe(false);
  });

  test('should set an error when the ref is null', () => {
    const { result } = renderHook(() => useScrollIntoView(null, [], 100));

    act(() => {
      result.current.scrollToElement();
    });

    expect(result.current.error).toEqual({
      message: 'Invalid ref provided or element not found.',
    });
  });

  test('should scroll when any trigger in the array is truthy', () => {
    vi.useFakeTimers();
    const ref = { current: document.createElement('div') };

    renderHook(() => useScrollIntoView(ref, [false, 0, 'ready'], 100));

    vi.runAllTimers();
    expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalled();
    vi.useRealTimers();
  });

  test('should not scroll when all triggers are falsy', () => {
    vi.useFakeTimers();
    const ref = { current: document.createElement('div') };

    renderHook(() => useScrollIntoView(ref, [false, 0, ''], 100));

    vi.runAllTimers();
    expect(window.HTMLElement.prototype.scrollIntoView).not.toHaveBeenCalled();
    vi.useRealTimers();
  });

  test('should clear the error on a subsequent successful scroll', () => {
    vi.useFakeTimers();
    const badRef = {
      current: {},
    } as unknown as React.RefObject<HTMLElement>;

    const { result, rerender } = renderHook(
      ({ r }) => useScrollIntoView(r, [], 100),
      { initialProps: { r: badRef } }
    );

    act(() => result.current.scrollToElement());
    expect(result.current.error).not.toBeNull();

    const goodRef = { current: document.createElement('div') };
    rerender({ r: goodRef });

    act(() => result.current.scrollToElement());
    expect(result.current.error).toBeNull();

    vi.useRealTimers();
  });
});
