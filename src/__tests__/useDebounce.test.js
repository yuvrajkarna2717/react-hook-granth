// src/__tests__/useDebounce.test.js
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useDebounce from '../hooks/useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  describe('Basic Functionality', () => {
    it('should return initial value immediately', () => {
      const { result } = renderHook(() => useDebounce('initial', 300));

      expect(result.current.debouncedValue).toBe('initial');
      expect(result.current.isPending).toBe(false);
    });

    it('should debounce value changes', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 300),
        { initialProps: { value: 'initial' } }
      );

      expect(result.current.debouncedValue).toBe('initial');

      // Change value
      rerender({ value: 'updated' });
      expect(result.current.debouncedValue).toBe('initial');
      expect(result.current.isPending).toBe(true);

      // Fast forward time
      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(result.current.debouncedValue).toBe('updated');
      expect(result.current.isPending).toBe(false);
    });

    it('should handle multiple rapid changes', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 300),
        { initialProps: { value: 'initial' } }
      );

      rerender({ value: 'change1' });
      expect(result.current.isPending).toBe(true);

      act(() => {
        vi.advanceTimersByTime(100);
      });

      rerender({ value: 'change2' });
      rerender({ value: 'final' });

      // Should still show initial value
      expect(result.current.debouncedValue).toBe('initial');

      act(() => {
        vi.advanceTimersByTime(300);
      });

      // Should show final value
      expect(result.current.debouncedValue).toBe('final');
      expect(result.current.isPending).toBe(false);
    });
  });

  describe('Leading Edge', () => {
    it('should execute immediately with leading option', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 300, { leading: true }),
        { initialProps: { value: 'initial' } }
      );

      expect(result.current.debouncedValue).toBe('initial');

      rerender({ value: 'updated' });

      // Should update immediately due to leading edge
      expect(result.current.debouncedValue).toBe('updated');
      // Should be pending because trailing is true by default
      expect(result.current.isPending).toBe(true);

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(result.current.isPending).toBe(false);
    });

    it('should work with leading only (no trailing)', () => {
      const { result, rerender } = renderHook(
        ({ value }) =>
          useDebounce(value, 300, { leading: true, trailing: false }),
        { initialProps: { value: 'initial' } }
      );

      rerender({ value: 'updated' });
      expect(result.current.debouncedValue).toBe('updated');
      // Should NOT be pending when trailing is false
      expect(result.current.isPending).toBe(false);

      // No trailing execution should occur
      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(result.current.debouncedValue).toBe('updated');
    });
  });

  //   describe("Max Wait", () => {
  //     it("should enforce maxWait timeout", () => {
  //       const { result, rerender } = renderHook(
  //         ({ value }) => useDebounce(value, 500, { maxWait: 300 }),
  //         { initialProps: { value: "initial" } }
  //       );

  //       // First change - starts both timers
  //       rerender({ value: "change1" });
  //       expect(result.current.isPending).toBe(true);
  //       expect(result.current.debouncedValue).toBe("initial");

  //       // Wait 200ms
  //       act(() => {
  //         vi.advanceTimersByTime(200);
  //       });

  //       // Second change before maxWait completes - resets regular timer but not maxWait
  //       rerender({ value: "change2" });
  //       expect(result.current.debouncedValue).toBe("initial"); // Still initial

  //       // Wait another 100ms (total 300ms = maxWait)
  //       act(() => {
  //         vi.advanceTimersByTime(100);
  //       });

  //       // MaxWait should have forced the update to latest value
  //       expect(result.current.debouncedValue).toBe("change2");
  //       expect(result.current.isPending).toBe(false);
  //     });
  //   });
  //
  //   describe("Max Wait", () => {
  //     it("should enforce maxWait timeout", () => {
  //       const { result, rerender } = renderHook(
  //         ({ value }) => useDebounce(value, 300, { maxWait: 500 }),
  //         { initialProps: { value: "initial" } }
  //       );

  //       // Rapid changes that would normally prevent debouncing
  //       rerender({ value: "change1" });

  //       act(() => {
  //         vi.advanceTimersByTime(200);
  //       });

  //       rerender({ value: "change2" });

  //       act(() => {
  //         vi.advanceTimersByTime(200);
  //       });

  //       rerender({ value: "final" });

  //       // Should still be initial due to rapid changes
  //       expect(result.current.debouncedValue).toBe("initial");

  //       // Max wait should trigger
  //       act(() => {
  //         vi.advanceTimersByTime(100); // Total 500ms
  //       });

  //       expect(result.current.debouncedValue).toBe("final");
  //     });
  //   });

  describe('Callbacks', () => {
    it('should call onDebounce callback', () => {
      const onDebounce = vi.fn();
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 300, { onDebounce }),
        { initialProps: { value: 'initial' } }
      );

      rerender({ value: 'updated' });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(onDebounce).toHaveBeenCalledWith('updated');
      expect(onDebounce).toHaveBeenCalledTimes(1);
    });

    it('should call onCancel callback', () => {
      const onCancel = vi.fn();
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 300, { onCancel }),
        { initialProps: { value: 'initial' } }
      );

      rerender({ value: 'updated' });

      act(() => {
        result.current.cancel();
      });

      expect(onCancel).toHaveBeenCalledTimes(1);
      expect(result.current.isPending).toBe(false);
    });
  });

  describe('Control Functions', () => {
    it('should cancel pending debounce', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 300),
        { initialProps: { value: 'initial' } }
      );

      rerender({ value: 'updated' });
      expect(result.current.isPending).toBe(true);

      act(() => {
        result.current.cancel();
      });

      expect(result.current.isPending).toBe(false);
      expect(result.current.debouncedValue).toBe('initial');

      // Time should not trigger update after cancel
      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(result.current.debouncedValue).toBe('initial');
    });

    it('should flush pending debounce', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 300),
        { initialProps: { value: 'initial' } }
      );

      rerender({ value: 'updated' });
      expect(result.current.isPending).toBe(true);
      expect(result.current.debouncedValue).toBe('initial');

      act(() => {
        result.current.flush();
      });

      expect(result.current.isPending).toBe(false);
      expect(result.current.debouncedValue).toBe('updated');
    });

    it('should not flush when not pending', () => {
      const { result } = renderHook(() => useDebounce('initial', 300));

      const initialValue = result.current.debouncedValue;

      act(() => {
        result.current.flush();
      });

      expect(result.current.debouncedValue).toBe(initialValue);
      expect(result.current.isPending).toBe(false);
    });
  });

  describe('Type Safety', () => {
    it('should work with different types', () => {
      // String
      const { result: stringResult } = renderHook(() =>
        useDebounce('test', 300)
      );
      expect(typeof stringResult.current.debouncedValue).toBe('string');

      // Number
      const { result: numberResult } = renderHook(() => useDebounce(42, 300));
      expect(typeof numberResult.current.debouncedValue).toBe('number');

      // Object
      const obj = { key: 'value' };
      const { result: objectResult } = renderHook(() => useDebounce(obj, 300));
      expect(objectResult.current.debouncedValue).toBe(obj);

      // Array
      const arr = [1, 2, 3];
      const { result: arrayResult } = renderHook(() => useDebounce(arr, 300));
      expect(arrayResult.current.debouncedValue).toBe(arr);
    });

    it('should handle null and undefined', () => {
      const { result: nullResult } = renderHook(() => useDebounce(null, 300));
      expect(nullResult.current.debouncedValue).toBeNull();

      const { result: undefinedResult } = renderHook(() =>
        useDebounce(undefined, 300)
      );
      expect(undefinedResult.current.debouncedValue).toBeUndefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero delay', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 0),
        { initialProps: { value: 'initial' } }
      );

      rerender({ value: 'updated' });

      act(() => {
        vi.advanceTimersByTime(0);
      });

      expect(result.current.debouncedValue).toBe('updated');
    });

    it('should handle negative delay', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, -100),
        { initialProps: { value: 'initial' } }
      );

      rerender({ value: 'updated' });

      act(() => {
        vi.advanceTimersByTime(0);
      });

      expect(result.current.debouncedValue).toBe('updated');
    });

    it('should handle same value changes', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 300),
        { initialProps: { value: 'same' } }
      );

      rerender({ value: 'same' });

      expect(result.current.isPending).toBe(false);
      expect(result.current.debouncedValue).toBe('same');
    });

    it('should handle object reference changes', () => {
      const obj1 = { id: 1, name: 'test' };
      const obj2 = { id: 1, name: 'test' }; // Same content, different reference

      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 300),
        { initialProps: { value: obj1 } }
      );

      expect(result.current.debouncedValue).toBe(obj1);

      rerender({ value: obj2 });
      expect(result.current.isPending).toBe(true);

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(result.current.debouncedValue).toBe(obj2);
    });
  });

  describe('Cleanup', () => {
    it('should cleanup timeouts on unmount', () => {
      const { result, rerender, unmount } = renderHook(
        ({ value }) => useDebounce(value, 300),
        { initialProps: { value: 'initial' } }
      );

      rerender({ value: 'updated' });
      expect(result.current.isPending).toBe(true);

      unmount();

      // Should not throw errors or cause memory leaks
      act(() => {
        vi.advanceTimersByTime(300);
      });
    });
  });

  describe('Performance', () => {
    it('should maintain function reference stability', () => {
      const { result, rerender } = renderHook(
        ({ delay }) => useDebounce('value', delay),
        { initialProps: { delay: 300 } }
      );

      const originalCancel = result.current.cancel;
      const originalFlush = result.current.flush;

      rerender({ delay: 300 }); // Same delay

      expect(result.current.cancel).toBe(originalCancel);
      expect(result.current.flush).toBe(originalFlush);
    });
  });
});
