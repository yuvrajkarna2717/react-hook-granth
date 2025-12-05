import { renderHook, act } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import useCounter from '../hooks/useCounter';

describe('useCounter Hook', () => {
  describe('Initialization', () => {
    test('should initialize with default value of 0', () => {
      const { result } = renderHook(() => useCounter());
      expect(result.current.count).toBe(0);
    });

    test('should initialize with custom initial value', () => {
      const { result } = renderHook(() => useCounter(5));
      expect(result.current.count).toBe(5);
    });

    test('should initialize with negative initial value', () => {
      const { result } = renderHook(() => useCounter(-3));
      expect(result.current.count).toBe(-3);
    });

    test('should initialize with zero when explicitly passed', () => {
      const { result } = renderHook(() => useCounter(0));
      expect(result.current.count).toBe(0);
    });
  });

  describe('Increment Functionality', () => {
    test('should increment count from default value', () => {
      const { result } = renderHook(() => useCounter());

      act(() => {
        result.current.increment();
      });

      expect(result.current.count).toBe(1);
    });

    test('should increment count from custom initial value', () => {
      const { result } = renderHook(() => useCounter(5));

      act(() => {
        result.current.increment();
      });

      expect(result.current.count).toBe(6);
    });

    test('should increment multiple times', () => {
      const { result } = renderHook(() => useCounter());

      act(() => {
        result.current.increment();
        result.current.increment();
        result.current.increment();
      });

      expect(result.current.count).toBe(3);
    });

    test('should increment from negative value', () => {
      const { result } = renderHook(() => useCounter(-2));

      act(() => {
        result.current.increment();
      });

      expect(result.current.count).toBe(-1);
    });
  });

  describe('Decrement Functionality', () => {
    test('should decrement count from default value', () => {
      const { result } = renderHook(() => useCounter());

      act(() => {
        result.current.decrement();
      });

      expect(result.current.count).toBe(-1);
    });

    test('should decrement count from custom initial value', () => {
      const { result } = renderHook(() => useCounter(5));

      act(() => {
        result.current.decrement();
      });

      expect(result.current.count).toBe(4);
    });

    test('should decrement multiple times', () => {
      const { result } = renderHook(() => useCounter(10));

      act(() => {
        result.current.decrement();
        result.current.decrement();
        result.current.decrement();
      });

      expect(result.current.count).toBe(7);
    });

    test('should decrement from negative value', () => {
      const { result } = renderHook(() => useCounter(-2));

      act(() => {
        result.current.decrement();
      });

      expect(result.current.count).toBe(-3);
    });
  });

  describe('Reset Functionality', () => {
    test('should reset to initial value after increment', () => {
      const { result } = renderHook(() => useCounter(10));

      act(() => {
        result.current.increment();
      });
      expect(result.current.count).toBe(11);

      act(() => {
        result.current.reset();
      });
      expect(result.current.count).toBe(10);
    });

    test('should reset to initial value after decrement', () => {
      const { result } = renderHook(() => useCounter(10));

      act(() => {
        result.current.decrement();
      });
      expect(result.current.count).toBe(9);

      act(() => {
        result.current.reset();
      });
      expect(result.current.count).toBe(10);
    });

    test('should reset to default value (0)', () => {
      const { result } = renderHook(() => useCounter());

      act(() => {
        result.current.increment();
        result.current.increment();
      });
      expect(result.current.count).toBe(2);

      act(() => {
        result.current.reset();
      });
      expect(result.current.count).toBe(0);
    });

    test('should reset to negative initial value', () => {
      const { result } = renderHook(() => useCounter(-5));

      act(() => {
        result.current.increment();
        result.current.increment();
      });
      expect(result.current.count).toBe(-3);

      act(() => {
        result.current.reset();
      });
      expect(result.current.count).toBe(-5);
    });
  });

  describe('Combined Operations', () => {
    test('should handle increment and decrement operations', () => {
      const { result } = renderHook(() => useCounter(5));

      act(() => {
        result.current.increment(); // 6
        result.current.increment(); // 7
        result.current.decrement(); // 6
        result.current.decrement(); // 5
        result.current.decrement(); // 4
      });

      expect(result.current.count).toBe(4);
    });

    test('should handle complex sequence of operations', () => {
      const { result } = renderHook(() => useCounter(0));

      act(() => {
        result.current.increment(); // 1
        result.current.increment(); // 2
        result.current.reset(); // 0
        result.current.decrement(); // -1
        result.current.increment(); // 0
        result.current.increment(); // 1
      });

      expect(result.current.count).toBe(1);
    });
  });

  describe('Function Stability', () => {
    test('should maintain function reference stability', () => {
      const { result, rerender } = renderHook(() => useCounter(0));

      const firstIncrement = result.current.increment;
      const firstDecrement = result.current.decrement;
      const firstReset = result.current.reset;

      // Trigger a rerender
      act(() => {
        result.current.increment();
      });
      rerender();

      // Functions should be the same reference (if using useCallback)
      // Note: Your current implementation doesn't use useCallback,
      // so this test will fail. Consider if you want function stability.
      expect(result.current.increment).toBe(firstIncrement);
      expect(result.current.decrement).toBe(firstDecrement);
      expect(result.current.reset).toBe(firstReset);
    });
  });

  describe('Return Value Structure', () => {
    test('should return object with correct properties', () => {
      const { result } = renderHook(() => useCounter());

      expect(result.current).toHaveProperty('count');
      expect(result.current).toHaveProperty('increment');
      expect(result.current).toHaveProperty('decrement');
      expect(result.current).toHaveProperty('reset');
    });

    test('should return functions for operations', () => {
      const { result } = renderHook(() => useCounter());

      expect(typeof result.current.increment).toBe('function');
      expect(typeof result.current.decrement).toBe('function');
      expect(typeof result.current.reset).toBe('function');
    });

    test('should return number for count', () => {
      const { result } = renderHook(() => useCounter());

      expect(typeof result.current.count).toBe('number');
    });
  });

  describe('Edge Cases', () => {
    test('should handle large numbers', () => {
      const largeNumber = 999999;
      const { result } = renderHook(() => useCounter(largeNumber));

      act(() => {
        result.current.increment();
      });

      expect(result.current.count).toBe(largeNumber + 1);
    });

    test('should handle undefined initial value', () => {
      const { result } = renderHook(() => useCounter(undefined));

      expect(result.current.count).toBe(0);
    });

    test('should handle null initial value', () => {
      const { result } = renderHook(() => useCounter(null));

      expect(result.current.count).toBe(0);
    });
  });
});
