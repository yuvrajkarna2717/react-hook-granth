import { renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import useLockBodyScroll from '../hooks/useLockBodyScroll';

describe('useLockBodyScroll', () => {
  beforeEach(() => {
    document.body.style.overflow = '';
  });

  it('locks body scroll when active', () => {
    renderHook(() => useLockBodyScroll(true));
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restores the original overflow on unmount', () => {
    document.body.style.overflow = 'auto';
    const { unmount } = renderHook(() => useLockBodyScroll(true));
    expect(document.body.style.overflow).toBe('hidden');
    unmount();
    expect(document.body.style.overflow).toBe('auto');
  });

  it('does nothing when locked is false', () => {
    document.body.style.overflow = 'scroll';
    renderHook(() => useLockBodyScroll(false));
    expect(document.body.style.overflow).toBe('scroll');
  });

  it('reacts to the locked flag changing', () => {
    const { rerender, unmount } = renderHook(
      ({ locked }) => useLockBodyScroll(locked),
      { initialProps: { locked: false } }
    );
    expect(document.body.style.overflow).toBe('');

    rerender({ locked: true });
    expect(document.body.style.overflow).toBe('hidden');

    unmount();
    expect(document.body.style.overflow).toBe('');
  });
});
