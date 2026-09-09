import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import useOrientation from '../hooks/useOrientation';

type Listener = () => void;

function installOrientation(initial: { type: string; angle: number }) {
  let current = { ...initial };
  const listeners = new Set<Listener>();
  const orientation = {
    get type() {
      return current.type;
    },
    get angle() {
      return current.angle;
    },
    addEventListener: (_: string, cb: Listener) => listeners.add(cb),
    removeEventListener: (_: string, cb: Listener) => listeners.delete(cb),
  };
  Object.defineProperty(window.screen, 'orientation', {
    configurable: true,
    value: orientation,
  });
  return {
    change(next: { type: string; angle: number }) {
      current = { ...next };
      listeners.forEach((l) => l());
    },
  };
}

describe('useOrientation', () => {
  afterEach(() => {
    // Remove the mocked orientation.
    Object.defineProperty(window.screen, 'orientation', {
      configurable: true,
      value: undefined,
    });
    vi.restoreAllMocks();
  });

  it('falls back to defaults when the API is unavailable', () => {
    Object.defineProperty(window.screen, 'orientation', {
      configurable: true,
      value: undefined,
    });
    const { result } = renderHook(() => useOrientation());
    expect(result.current).toEqual({ type: 'portrait-primary', angle: 0 });
  });

  it('reads the initial orientation', () => {
    installOrientation({ type: 'landscape-primary', angle: 90 });
    const { result } = renderHook(() => useOrientation());
    expect(result.current).toEqual({ type: 'landscape-primary', angle: 90 });
  });

  it('updates on orientation change', () => {
    const controls = installOrientation({ type: 'portrait-primary', angle: 0 });
    const { result } = renderHook(() => useOrientation());

    act(() => controls.change({ type: 'landscape-primary', angle: 90 }));
    expect(result.current).toEqual({ type: 'landscape-primary', angle: 90 });
  });
});
