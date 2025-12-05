import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import useMeasure from '../hooks/useMeasure';

describe('useMeasure', () => {
  it('should return ref and initial bounds', () => {
    const { result } = renderHook(() => useMeasure());
    const [ref, bounds] = result.current;

    expect(ref.current).toBe(null);
    expect(bounds).toEqual({ width: 0, height: 0 });
  });

  it('should measure element when ref is set', () => {
    const mockElement = {
      getBoundingClientRect: vi.fn(() => ({ width: 100, height: 50 })),
    };

    const { result } = renderHook(() => useMeasure());
    const [ref] = result.current;

    // Simulate setting the ref
    ref.current = mockElement;

    // Trigger measure by dispatching resize event
    window.dispatchEvent(new Event('resize'));

    expect(mockElement.getBoundingClientRect).toHaveBeenCalled();
  });
});
