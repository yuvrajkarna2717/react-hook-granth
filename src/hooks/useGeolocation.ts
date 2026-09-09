import { useEffect, useState } from 'react';

export interface GeolocationState {
  loading: boolean;
  /** Latest coordinates, or `null` before the first fix / on error. */
  coords: {
    latitude: number;
    longitude: number;
    accuracy: number;
    altitude: number | null;
    altitudeAccuracy: number | null;
    heading: number | null;
    speed: number | null;
  } | null;
  timestamp: number | null;
  error: GeolocationPositionError | Error | null;
}

/**
 * Access and subscribe to the browser Geolocation API.
 *
 * Watches the position and updates on change. Sets an `error` when geolocation
 * is unavailable or the user denies permission. SSR-safe.
 * @param options - Standard `PositionOptions`.
 * @returns `{ loading, coords, timestamp, error }`.
 */
export default function useGeolocation(
  options?: PositionOptions
): GeolocationState {
  const [state, setState] = useState<GeolocationState>({
    loading: true,
    coords: null,
    timestamp: null,
    error: null,
  });

  // Serialize options for a stable effect dependency.
  const optionsKey = options ? JSON.stringify(options) : '';

  useEffect(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setState((s) => ({
        ...s,
        loading: false,
        error: new Error('Geolocation is not supported'),
      }));
      return;
    }

    const onSuccess = (position: GeolocationPosition) => {
      const c = position.coords;
      setState({
        loading: false,
        coords: {
          latitude: c.latitude,
          longitude: c.longitude,
          accuracy: c.accuracy,
          altitude: c.altitude,
          altitudeAccuracy: c.altitudeAccuracy,
          heading: c.heading,
          speed: c.speed,
        },
        timestamp: position.timestamp,
        error: null,
      });
    };

    const onError = (error: GeolocationPositionError) => {
      setState((s) => ({ ...s, loading: false, error }));
    };

    // Capture the reference so cleanup works even if the global is torn down.
    const geo = navigator.geolocation;
    const watchId = geo.watchPosition(onSuccess, onError, options);

    return () => geo.clearWatch(watchId);
    // optionsKey captures option changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionsKey]);

  return state;
}
