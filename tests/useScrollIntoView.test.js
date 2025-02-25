import { renderHook, act } from "@testing-library/react-hooks";
import { describe, test, expect, vi } from "vitest";
import useScrollIntoView from "../src/hooks/useScrollIntoView";

// Mock scrollIntoView
window.HTMLElement.prototype.scrollIntoView = vi.fn();

// describe("useScrollIntoView Hook", () => {
test("should not scroll if ref is invalid", () => {
  const { result } = renderHook(() => useScrollIntoView(null, [], 100));

  console.log("message", result.current.error);

  expect(result.error).toEqual({
    message: "Invalid ref provided or element not found.",
  });
  expect(result.current.hasScrolled).toBe(false);
});

// test("should scroll when a trigger changes", () => {
//   const ref = { current: document.createElement("div") };
//   const { result, rerender } = renderHook(
//     ({ triggers }) => useScrollIntoView(ref, triggers, 100),
//     { initialProps: { triggers: [false] } }
//   );

//   expect(result.current.hasScrolled).toBe(false);

//   rerender({ triggers: [true] });

//   expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalled();
// });

// test("should manually scroll when scrollToElement is called", () => {
//   const ref = { current: document.createElement("div") };
//   const { result } = renderHook(() => useScrollIntoView(ref, [], 100));

//   act(() => {
//     result.current.scrollToElement();
//   });

//   expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalled();
// });

// test("should execute onScrollComplete callback after scrolling", async () => {
//   const ref = { current: document.createElement("div") };
//   const onScrollComplete = vi.fn();

//   const { result } = renderHook(() =>
//     useScrollIntoView(ref, [], 100, {}, onScrollComplete)
//   );

//   act(() => {
//     result.current.scrollToElement();
//   });

//   await waitFor(() => {
//     expect(onScrollComplete).toHaveBeenCalled();
//   });
// });
// });
