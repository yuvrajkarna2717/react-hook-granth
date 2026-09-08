import { useEffect, useState } from 'react';

export interface NetworkSpeed {
  connectionType: string;
  downlink: number;
}

/**
 * Minimal shape of the (experimental) Network Information API.
 * Typed locally because it is not in the standard DOM lib.
 */
interface NetworkInformationLike extends EventTarget {
  effectiveType?: string;
  downlink?: number;
  addEventListener(type: 'change', listener: () => void): void;
  removeEventListener(type: 'change', listener: () => void): void;
}

function getConnection(): NetworkInformationLike | undefined {
  if (typeof navigator === 'undefined') return undefined;
  const nav = navigator as Navigator & {
    connection?: NetworkInformationLike;
    mozConnection?: NetworkInformationLike;
    webkitConnection?: NetworkInformationLike;
  };
  return nav.connection ?? nav.mozConnection ?? nav.webkitConnection;
}

/**
 * Track the network connection type and downlink speed.
 *
 * Uses the experimental Network Information API where available and updates
 * whenever the connection changes. Falls back to `unknown`/`0` otherwise.
 * @returns Current connection details
 */
export default function useNetworkSpeed(): NetworkSpeed {
  const [networkSpeed, setNetworkSpeed] = useState<NetworkSpeed>({
    connectionType: 'unknown',
    downlink: 0,
  });

  useEffect(() => {
    const connection = getConnection();

    const updateNetworkSpeed = (): void => {
      const current = getConnection();
      if (current) {
        setNetworkSpeed({
          connectionType: current.effectiveType ?? 'unknown',
          downlink: current.downlink ?? 0,
        });
      }
    };

    updateNetworkSpeed(); // Initial read

    if (connection && typeof connection.addEventListener === 'function') {
      connection.addEventListener('change', updateNetworkSpeed);
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('online', updateNetworkSpeed);
      window.addEventListener('offline', updateNetworkSpeed);
    }

    return () => {
      if (connection && typeof connection.removeEventListener === 'function') {
        connection.removeEventListener('change', updateNetworkSpeed);
      }
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', updateNetworkSpeed);
        window.removeEventListener('offline', updateNetworkSpeed);
      }
    };
  }, []);

  return networkSpeed;
}
