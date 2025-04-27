import { renderHook, act } from "@testing-library/react-hooks";
import { describe, test, expect, vi } from "vitest";
import { waitFor } from "@testing-library/react";

import useScrollIntoView from "../src/hooks/useScrollIntoView";

beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("useScrollIntoView Hook", () => {
  test("should not scroll if ref is invalid", () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useScrollIntoView(null, [], 100));

    vi.runAllTimers();

    waitFor(() => {
      expect(result.current.error).toEqual({
        message: "Invalid ref provided or element not found.",
      });
    });
    expect(result.current.hasScrolled).toBe(false);

    vi.useRealTimers();
  });

  test("should scroll when a trigger changes", async () => {
    vi.useFakeTimers();

    const ref = { current: document.createElement("div") };
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

  test("should manually scroll when scrollToElement is called", () => {
    vi.useFakeTimers();

    const ref = { current: document.createElement("div") };
    const { result } = renderHook(() => useScrollIntoView(ref, [], 100));

    act(() => {
      result.current.scrollToElement();
    });

    vi.runAllTimers();

    expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalled();
    vi.useRealTimers();
  });

  test("should execute onScrollComplete callback after scrolling", async () => {
    vi.useFakeTimers();

    const ref = { current: document.createElement("div") };
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
});
