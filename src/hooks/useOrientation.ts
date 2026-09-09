import { useEffect, useState } from 'react';

export interface OrientationState {
  /** e.g. `'portrait-primary'`, `'landscape-primary'`. */
  type: string;
  /** Rotation angle in degrees. */
  angle: number;
}

const DEFAULT: OrientationState = { type: 'portrait-primary', angle: 0 };

function read(): OrientationState {
  if (typeof window === 'undefined' || !window.screen?.orientation) {
    return DEFAULT;
  }
  const { type, angle } = window.screen.orientation;
  return { type, angle };
}

/**
 * Track the screen orientation type and angle (Screen Orientation API).
 *
 * Falls back to portrait defaults when the API is unavailable (including SSR).
 * @returns `{ type, angle }`.
 */
export default function useOrientation(): OrientationState {
  const [orientation, setOrientation] = useState<OrientationState>(read);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.screen?.orientation) {
      return;
    }

    const target = window.screen.orientation;
    const onChange = () => setOrientation(read());

    target.addEventListener('change', onChange);
    return () => target.removeEventListener('change', onChange);
  }, []);

  return orientation;
}
