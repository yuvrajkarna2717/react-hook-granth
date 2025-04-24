import { useEffect, useState } from "react";

/**
 * Sync state with sessionStorage.
 * @param {string} key
 * @param {*} initialValue
 */
export default function useSessionStorage(key, initialValue) {
  const getValue = () => {
    const stored = sessionStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  };

  const [value, setValue] = useState(getValue);

  useEffect(() => {
    sessionStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
