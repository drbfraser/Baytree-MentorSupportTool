import { useState } from "react";

// Reference: https://usehooks.com/useLocalStorage/
function useLocalStorage<T>(key: string, initialValue: T | undefined) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T | undefined>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });
  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (
    value: T | undefined | ((val: T | undefined) => T | undefined)
  ) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage if value exists
      if (value && typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } else {
        // Otherwise, delete remove the value from the key
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };

  return [storedValue, setValue] as const;
}

export default useLocalStorage;
