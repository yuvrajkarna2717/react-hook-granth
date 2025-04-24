import { useEffect, useState } from "react";

/**
 * Track the network speed and connection type.
 * @returns {{ connectionType: string, downlink: number }} - Network connection details.
 */
export default function useNetworkSpeed() {
  const [networkSpeed, setNetworkSpeed] = useState({
    connectionType: "unknown",
    downlink: 0,
  });

  useEffect(() => {
    const updateNetworkSpeed = () => {
      if (navigator.connection) {
        const { effectiveType, downlink } = navigator.connection;
        setNetworkSpeed({ connectionType: effectiveType, downlink });
      }
    };

    updateNetworkSpeed(); // Initial update
    window.addEventListener("online", updateNetworkSpeed);
    window.addEventListener("offline", updateNetworkSpeed);

    return () => {
      window.removeEventListener("online", updateNetworkSpeed);
      window.removeEventListener("offline", updateNetworkSpeed);
    };
  }, []);

  return networkSpeed;
}
