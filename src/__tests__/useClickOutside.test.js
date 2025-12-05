// src/__tests__/useClickOutside.test.js
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import useClickOutside from '../hooks/useClickOutside';

describe('useClickOutside', () => {
  let mockHandler;
  let targetElement;
  let outsideElement;

  beforeEach(() => {
    mockHandler = vi.fn();

    // Create test elements
    targetElement = document.createElement('div');
    targetElement.setAttribute('data-testid', 'inside-element');
    document.body.appendChild(targetElement);

    outsideElement = document.createElement('div');
    outsideElement.setAttribute('data-testid', 'outside-element');
    document.body.appendChild(outsideElement);
  });

  afterEach(() => {
    // Clean up
    if (document.body.contains(targetElement)) {
      document.body.removeChild(targetElement);
    }
    if (document.body.contains(outsideElement)) {
      document.body.removeChild(outsideElement);
    }
    vi.clearAllMocks();
  });

  it('should return a ref object', () => {
    const { result } = renderHook(() => useClickOutside(mockHandler));

    expect(result.current).toBeDefined();
    expect(result.current.current).toBeNull();
  });

  it('should call handler when clicking outside the element', () => {
    const { result } = renderHook(() => useClickOutside(mockHandler));

    // Attach ref to target element
    result.current.current = targetElement;

    // Click outside element
    fireEvent.mouseDown(outsideElement);

    expect(mockHandler).toHaveBeenCalledTimes(1);
  });

  it('should NOT call handler when clicking inside the element', () => {
    const { result } = renderHook(() => useClickOutside(mockHandler));

    // Attach ref to target element
    result.current.current = targetElement;

    // Click inside target element
    fireEvent.mouseDown(targetElement);

    expect(mockHandler).not.toHaveBeenCalled();
  });

  it('should call handler on touchstart outside the element', () => {
    const { result } = renderHook(() => useClickOutside(mockHandler));

    // Attach ref to target element
    result.current.current = targetElement;

    // Touch outside element
    fireEvent.touchStart(outsideElement);

    expect(mockHandler).toHaveBeenCalledTimes(1);
  });

  it('should NOT call handler on touchstart inside the element', () => {
    const { result } = renderHook(() => useClickOutside(mockHandler));

    // Attach ref to target element
    result.current.current = targetElement;

    // Touch inside target element
    fireEvent.touchStart(targetElement);

    expect(mockHandler).not.toHaveBeenCalled();
  });

  it('should pass the event object to the handler', () => {
    const { result } = renderHook(() => useClickOutside(mockHandler));

    // Attach ref to target element
    result.current.current = targetElement;

    // Click outside element
    fireEvent.mouseDown(outsideElement);

    expect(mockHandler).toHaveBeenCalledWith(expect.any(Event));
  });

  it('should handle nested child elements correctly', () => {
    const { result } = renderHook(() => useClickOutside(mockHandler));

    // Create nested child element
    const childElement = document.createElement('span');
    childElement.setAttribute('data-testid', 'nested-child');
    targetElement.appendChild(childElement);

    // Attach ref to target element
    result.current.current = targetElement;

    // Click on nested child (should not trigger handler)
    fireEvent.mouseDown(childElement);

    expect(mockHandler).not.toHaveBeenCalled();
  });

  it('should work correctly when handler changes', () => {
    const firstHandler = vi.fn();
    const secondHandler = vi.fn();

    const { result, rerender } = renderHook(
      ({ handler }) => useClickOutside(handler),
      { initialProps: { handler: firstHandler } }
    );

    // Attach ref to target element
    result.current.current = targetElement;

    // Click with first handler
    fireEvent.mouseDown(outsideElement);
    expect(firstHandler).toHaveBeenCalledTimes(1);
    expect(secondHandler).not.toHaveBeenCalled();

    // Change handler
    rerender({ handler: secondHandler });

    // Click with second handler
    fireEvent.mouseDown(outsideElement);
    expect(firstHandler).toHaveBeenCalledTimes(1);
    expect(secondHandler).toHaveBeenCalledTimes(1);
  });

  it('should remove event listeners on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

    const { result, unmount } = renderHook(() => useClickOutside(mockHandler));

    // Attach ref to target element
    result.current.current = targetElement;

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'mousedown',
      expect.any(Function)
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'touchstart',
      expect.any(Function)
    );

    removeEventListenerSpy.mockRestore();
  });

  it('should handle null ref gracefully', () => {
    const { result } = renderHook(() => useClickOutside(mockHandler));

    // Don't attach ref to any element (ref.current remains null)

    // Click anywhere - handler should NOT be called when ref.current is null
    fireEvent.mouseDown(outsideElement);

    // Should NOT call handler when ref.current is null
    expect(mockHandler).not.toHaveBeenCalled();
  });

  it('should handle events with no target', () => {
    const { result } = renderHook(() => useClickOutside(mockHandler));

    // Attach ref to target element
    result.current.current = targetElement;

    // Create a custom event with no target
    const customEvent = new Event('mousedown');
    Object.defineProperty(customEvent, 'target', {
      value: null,
      writable: false,
    });

    document.dispatchEvent(customEvent);

    // Should not call handler when target is null
    expect(mockHandler).not.toHaveBeenCalled();
  });
});
