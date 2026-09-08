/**
 * Server-side rendering (SSR) safety.
 *
 * These render hooks with `react-dom/server` (which never touches the DOM) so
 * we can simulate a server environment by removing `window` / `navigator`.
 * A hook is SSR-safe if rendering does not throw and it produces sane defaults.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import useWindowSize from '../hooks/useWindowSize';
import useScrollPosition from '../hooks/useScrollPosition';
import useMediaQuery from '../hooks/useMediaQuery';
import useOnlineStatus from '../hooks/useOnlineStatus';
import useNetworkSpeed from '../hooks/useNetworkSpeed';
import useLocalStorage from '../hooks/useLocalStorage';
import useSessionStorage from '../hooks/useSessionStorage';
import useIdle from '../hooks/useIdle';

/** Render a hook on the "server" and return its value via a probe component. */
function renderOnServer<T>(useHook: () => T): T {
  let captured!: T;
  function Probe() {
    captured = useHook();
    return null;
  }
  renderToStaticMarkup(createElement(Probe));
  return captured;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('SSR safety', () => {
  it('useWindowSize returns zeroed size without window', () => {
    vi.stubGlobal('window', undefined);
    expect(renderOnServer(() => useWindowSize())).toEqual({
      width: 0,
      height: 0,
    });
  });

  it('useScrollPosition returns origin without window', () => {
    vi.stubGlobal('window', undefined);
    expect(renderOnServer(() => useScrollPosition())).toEqual({ x: 0, y: 0 });
  });

  it('useMediaQuery returns false without window', () => {
    vi.stubGlobal('window', undefined);
    expect(renderOnServer(() => useMediaQuery('(min-width: 768px)'))).toBe(
      false
    );
  });

  it('useOnlineStatus assumes online without navigator', () => {
    vi.stubGlobal('navigator', undefined);
    expect(renderOnServer(() => useOnlineStatus())).toBe(true);
  });

  it('useNetworkSpeed returns unknown defaults without navigator', () => {
    vi.stubGlobal('navigator', undefined);
    expect(renderOnServer(() => useNetworkSpeed())).toEqual({
      connectionType: 'unknown',
      downlink: 0,
    });
  });

  it('useLocalStorage returns the initial value without window', () => {
    vi.stubGlobal('window', undefined);
    const [value] = renderOnServer(() => useLocalStorage('k', 'fallback'));
    expect(value).toBe('fallback');
  });

  it('useSessionStorage returns the initial value without window', () => {
    vi.stubGlobal('window', undefined);
    const [value] = renderOnServer(() => useSessionStorage('k', 'fallback'));
    expect(value).toBe('fallback');
  });

  it('useIdle does not throw and starts not-idle without window', () => {
    vi.stubGlobal('window', undefined);
    expect(renderOnServer(() => useIdle(1000))).toBe(false);
  });
});
