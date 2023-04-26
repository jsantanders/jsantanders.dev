/* eslint-disable react-hooks/exhaustive-deps */

import type { DependencyList } from "react";
import { useEffect, useState } from "react";

type ScrollPosition = {
  scrollX: number;
  scrollY: number;
};

const isRenderingOnServer = typeof window === "undefined";

/**
 * Get the current scroll position.
 * @returns {ScrollPosition} The current scroll position.
 */
const getScrollPosition = (): ScrollPosition => ({
  scrollX: isRenderingOnServer ? 0 : window.pageXOffset,
  scrollY: isRenderingOnServer ? 0 : window.pageYOffset,
});

/**
 * Scroll position hook.
 * @param {Function} callback a callback function that will be called when the scroll position changes.
 * @param {Array} deps an array of dependencies.
 * @returns {ScrollPosition} The current scroll position.
 */
export const useScrollPosition = (
  callback?: (position: ScrollPosition) => void,
  deps: DependencyList = []
): ScrollPosition => {
  const [scrollPosition, setScrollPosition] = useState(getScrollPosition);

  useEffect(() => {
    // eslint-disable-next-line require-jsdoc
    const handleScroll = () => {
      const currentScrollPosition = getScrollPosition();

      setScrollPosition(currentScrollPosition);

      if (callback) {
        callback(currentScrollPosition);
      }
    };

    const opts: AddEventListenerOptions & EventListenerOptions = {
      passive: true,
    };

    window.addEventListener("scroll", handleScroll, opts);

    return () => window.removeEventListener("scroll", handleScroll, opts);
  }, deps);

  return scrollPosition;
};
