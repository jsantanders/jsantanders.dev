import { animated } from "@react-spring/web";

import { useBoop, UseBoopProps } from "@/hooks/use-boop";

type BoopProps = React.PropsWithChildren<
  {
    style?: React.CSSProperties;
  } & UseBoopProps
>;

/**
 * Boop effect for buttons, links, etc.
 * @param {React.PropsWithChildren<BoopProps>} children children component
 * @returns {React.ReactElement} React component
 */
export const Boop: React.FC<BoopProps> = ({ children, style: customStyle, ...boopConfig }) => {
  const [style, trigger] = useBoop(boopConfig);
  return (
    <animated.span
      className="focus:outline-none"
      onMouseEnter={() => trigger(true)}
      onMouseLeave={boopConfig.fix ? () => trigger(false) : undefined}
      style={{ ...style, ...customStyle }}
    >
      {children}
    </animated.span>
  );
};
