import { useCallback, useState } from "react";

import { useScrollPosition } from "@/hooks/use-scroll-position";

/**
 * Hook to hide the navigation bar when scrolling down and show it when scrolling up.
 * @returns {Array} A tuple containing the navRef and isNavVisible.
 */
const useHiddenNav = (): [(instance: HTMLElement | null) => void, boolean] => {
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [navHeight, setNavHeight] = useState(0);
  const navRef = useCallback((instance: HTMLElement | null) => {
    if (instance !== null) {
      setNavHeight(instance.getBoundingClientRect().height);
    }
  }, []);

  useScrollPosition(
    ({ scrollY }) => {
      if (lastScrollY && scrollY === 0) {
        setIsNavVisible(true);
      }

      if (scrollY < navHeight) {
        return;
      }

      const documentHeight = document.documentElement.scrollHeight - navHeight;
      const windowHeight = window.innerHeight;

      if (lastScrollY && scrollY >= lastScrollY) {
        setIsNavVisible(false);
      } else if (scrollY + windowHeight < documentHeight) {
        setIsNavVisible(true);
      }

      setLastScrollY(scrollY);
    },
    [lastScrollY, navHeight]
  );

  return [navRef, isNavVisible];
};

export default useHiddenNav;
