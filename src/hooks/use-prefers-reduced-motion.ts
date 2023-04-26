import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: no-preference)";

const isRenderingOnServer = typeof window === "undefined";

/**
 * Get the initial state of prefers-reduced-motion
 * @returns {boolean} the initial state
 */
const getInitialState = () => {
  return isRenderingOnServer ? true : !window.matchMedia(QUERY).matches;
};

/**
 * Hook to detect if the user prefers reduced motion
 * @returns {boolean} true if the user prefers reduced motion, false otherwise.
 */
export const usePrefersReducedMotion = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(getInitialState);

  useEffect(() => {
    const mediaQuery = window.matchMedia(QUERY);

    // eslint-disable-next-line require-jsdoc
    const handleChange = (event: MediaQueryListEvent) => setPrefersReducedMotion(!event.matches);

    try {
      mediaQuery.addEventListener("change", handleChange);
    } catch (_) {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      try {
        mediaQuery.removeEventListener("change", handleChange);
      } catch (_) {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return prefersReducedMotion;
};
