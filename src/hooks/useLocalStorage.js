import { useState, useEffect } from "react";

/**
 * Custom hook to sync state with localStorage.
 * @param {string} key - localStorage key.
 * @param {*} initialValue - Initial value or function returning initial value.
 * @returns {[any, Function]} - [storedValue, setStoredValue]
 */
function useLocalStorage(key, initialValue) {
  const getSavedValue = () => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading from localStorage", error);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState(getSavedValue);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      }
    } catch (error) {
      console.error("Error writing to localStorage", error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;