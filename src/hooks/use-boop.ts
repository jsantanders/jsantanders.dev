/* eslint-disable @typescript-eslint/no-explicit-any */

import type { SpringConfig } from "@react-spring/web";
import { useSpring } from "@react-spring/web";
import { useCallback, useEffect, useState } from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

export type UseBoopProps = {
  x?: number;
  y?: number;
  rotation?: number;
  scale?: number;
  timing?: number;
  fix?: boolean;
  springConfig?: SpringConfig;
};

/**
 * Hook to create a boop effect
 * check more about this effect here: https://www.joshwcomeau.com/react/boop/
 * @param {UseBoopProps} props the hook props
 * @returns {Tuple} tuple of the style and the trigger function
 */
export const useBoop = ({
  x = 0,
  y = 0,
  rotation = 0,
  scale = 1,
  timing = 150,
  fix = false,
  springConfig = {
    tension: 300,
    friction: 10,
  },
}: UseBoopProps): [any, (bool: boolean) => void] => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isBooped, setIsBooped] = useState(false);

  const style = useSpring({
    display: "inline-block",
    transform: isBooped
      ? `translate(${x}px, ${y}px) rotate(${rotation}deg) scale(${scale})`
      : "translate(0px, 0px) rotate(0deg) scale(1)",
    config: springConfig,
    immediate: prefersReducedMotion,
  });

  useEffect(() => {
    if (!isBooped || fix) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setIsBooped(false);
    }, timing);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isBooped, timing, fix]);

  const trigger = useCallback((bool: boolean) => {
    setIsBooped(bool);
  }, []);

  return [style, trigger];
};
