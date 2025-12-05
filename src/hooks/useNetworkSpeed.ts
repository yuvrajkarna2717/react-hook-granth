import { useEffect, useState } from 'react';

interface NetworkSpeed {
  connectionType: string;
  downlink: number;
}

/**
 * Track the network speed and connection type.
 * @returns Network connection details
 */
export default function useNetworkSpeed(): NetworkSpeed {
  const [networkSpeed, setNetworkSpeed] = useState<NetworkSpeed>({
    connectionType: 'unknown',
    downlink: 0,
  });

  useEffect(() => {
    const updateNetworkSpeed = (): void => {
      if ('connection' in navigator && (navigator as any).connection) {
        const { effectiveType, downlink } = (navigator as any).connection;
        setNetworkSpeed({ connectionType: effectiveType, downlink });
      }
    };

    updateNetworkSpeed(); // Initial update
    window.addEventListener('online', updateNetworkSpeed);
    window.addEventListener('offline', updateNetworkSpeed);

    return () => {
      window.removeEventListener('online', updateNetworkSpeed);
      window.removeEventListener('offline', updateNetworkSpeed);
    };
  }, []);

  return networkSpeed;
}
