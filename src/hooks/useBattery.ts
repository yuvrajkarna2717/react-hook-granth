import { useEffect, useState } from 'react';

export interface BatteryState {
  /** Whether the Battery Status API is available. */
  supported: boolean;
  /** True until the first reading resolves. */
  loading: boolean;
  /** Charge level from 0 to 1. */
  level: number;
  charging: boolean;
  /** Seconds until full, or `Infinity`. */
  chargingTime: number;
  /** Seconds until empty, or `Infinity`. */
  dischargingTime: number;
}

interface BatteryManagerLike extends EventTarget {
  level: number;
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
}

type NavigatorWithBattery = Navigator & {
  getBattery?: () => Promise<BatteryManagerLike>;
};

const INITIAL: BatteryState = {
  supported: true,
  loading: true,
  level: 1,
  charging: false,
  chargingTime: 0,
  dischargingTime: 0,
};

const UNSUPPORTED: BatteryState = {
  ...INITIAL,
  supported: false,
  loading: false,
};

/**
 * Track battery status via the Battery Status API.
 *
 * Support is limited across browsers; when unavailable, `supported` is `false`
 * and `loading` is `false`.
 * @returns Current battery state.
 */
export default function useBattery(): BatteryState {
  const [state, setState] = useState<BatteryState>(() => {
    const nav =
      typeof navigator !== 'undefined'
        ? (navigator as NavigatorWithBattery)
        : undefined;
    return nav && typeof nav.getBattery === 'function' ? INITIAL : UNSUPPORTED;
  });

  useEffect(() => {
    const nav =
      typeof navigator !== 'undefined'
        ? (navigator as NavigatorWithBattery)
        : undefined;
    if (!nav || typeof nav.getBattery !== 'function') return;

    let cancelled = false;
    let cleanup: (() => void) | null = null;

    const update = (b: BatteryManagerLike) => {
      setState({
        supported: true,
        loading: false,
        level: b.level,
        charging: b.charging,
        chargingTime: b.chargingTime,
        dischargingTime: b.dischargingTime,
      });
    };

    nav.getBattery().then((b) => {
      if (cancelled) return;
      update(b);
      const onChange = () => update(b);
      b.addEventListener('levelchange', onChange);
      b.addEventListener('chargingchange', onChange);
      b.addEventListener('chargingtimechange', onChange);
      b.addEventListener('dischargingtimechange', onChange);
      cleanup = () => {
        b.removeEventListener('levelchange', onChange);
        b.removeEventListener('chargingchange', onChange);
        b.removeEventListener('chargingtimechange', onChange);
        b.removeEventListener('dischargingtimechange', onChange);
      };
    });

    return () => {
      cancelled = true;
      if (cleanup) cleanup();
    };
  }, []);

  return state;
}
