import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import useKeyPress from '../hooks/useKeyPress';

const press = (key: string, type: 'keydown' | 'keyup' = 'keydown') =>
  act(() => window.dispatchEvent(new KeyboardEvent(type, { key })));

describe('useKeyPress', () => {
  it('fires for a single matching key', () => {
    const handler = vi.fn();
    renderHook(() => useKeyPress('Escape', handler));

    press('Escape');
    expect(handler).toHaveBeenCalledTimes(1);

    press('Enter');
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('fires for any key in an array', () => {
    const handler = vi.fn();
    renderHook(() => useKeyPress(['a', 'b'], handler));

    press('a');
    press('b');
    press('c');
    expect(handler).toHaveBeenCalledTimes(2);
  });

  it('respects the keyup event option', () => {
    const handler = vi.fn();
    renderHook(() => useKeyPress('Enter', handler, { event: 'keyup' }));

    press('Enter', 'keydown');
    expect(handler).not.toHaveBeenCalled();

    press('Enter', 'keyup');
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('passes the KeyboardEvent to the handler', () => {
    const handler = vi.fn();
    renderHook(() => useKeyPress('k', handler));
    press('k');
    expect(handler.mock.calls[0][0]).toBeInstanceOf(KeyboardEvent);
  });

  it('removes the listener on unmount', () => {
    const handler = vi.fn();
    const { unmount } = renderHook(() => useKeyPress('x', handler));
    unmount();
    press('x');
    expect(handler).not.toHaveBeenCalled();
  });
});
