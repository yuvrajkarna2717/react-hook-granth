import { useEffect, useRef, RefObject } from 'react';

/**
 * Target that a listener can be attached to. Defaults to `window`.
 */
type Target =
  | Window
  | Document
  | HTMLElement
  | MediaQueryList
  | RefObject<HTMLElement | null>
  | null;

// Overloads give precise event-map typing per target type.
function useEventListener<K extends keyof WindowEventMap>(
  event: K,
  handler: (event: WindowEventMap[K]) => void,
  element?: undefined,
  options?: boolean | AddEventListenerOptions
): void;
function useEventListener<K extends keyof HTMLElementEventMap>(
  event: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  element: RefObject<HTMLElement | null> | HTMLElement,
  options?: boolean | AddEventListenerOptions
): void;
function useEventListener<K extends keyof DocumentEventMap>(
  event: K,
  handler: (event: DocumentEventMap[K]) => void,
  element: Document,
  options?: boolean | AddEventListenerOptions
): void;
function useEventListener<K extends keyof MediaQueryListEventMap>(
  event: K,
  handler: (event: MediaQueryListEventMap[K]) => void,
  element: MediaQueryList,
  options?: boolean | AddEventListenerOptions
): void;

/**
 * Attach an event listener with automatic cleanup and always-latest handler.
 *
 * The handler is stored in a ref, so passing an inline function does not
 * re-subscribe on every render. SSR-safe: does nothing when the resolved
 * target is unavailable.
 *
 * @param event - Event name (e.g. `'resize'`, `'keydown'`).
 * @param handler - Event handler.
 * @param element - Target: `window` (default), `document`, an element, a ref,
 *   or a `MediaQueryList`.
 * @param options - `addEventListener` options.
 */
function useEventListener(
  event: string,
  handler: (event: Event) => void,
  element?: Target,
  options?: boolean | AddEventListenerOptions
): void {
  const handlerRef = useRef(handler);
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    // Resolve refs to their current node; default to window.
    const target: EventTarget | null =
      element && 'current' in element
        ? element.current
        : ((element as EventTarget | null) ??
          (typeof window !== 'undefined' ? window : null));

    if (!target || !target.addEventListener) return;

    const listener = (e: Event) => handlerRef.current(e);
    target.addEventListener(event, listener, options);

    return () => {
      target.removeEventListener(event, listener, options);
    };
    // `handler` intentionally excluded — it is read from the ref.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, element, JSON.stringify(options)]);
}

export default useEventListener;
