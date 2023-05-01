import { useEffect, useState } from "react";

type Tuple<T> = [T, (value: T) => void];

/**
 * Hook to persist state in local storage
 * @param {string} key the key to be used in local storage
 * @param {Record<string,unknown>} defaultValue value to be persisted in case there is no value in local storage
 * @returns {Tuple<T>} the value and a function to set the value
 */
export const usePersistedState = <T>(key: string, defaultValue: T): Tuple<T> => {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    if (!window.localStorage) {
      return;
    }

    const stickyValue = window.localStorage.getItem(key);

    if (stickyValue !== null) {
      setValue(JSON.parse(stickyValue));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (window.localStorage?.getItem(key) === undefined) {
      window.localStorage?.setItem(key, JSON.stringify(value));
    }
  }, [key, value]);

  return [value, setValue];
};
