/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable require-jsdoc */
import React, { CSSProperties, useState } from "react";

interface RatingSymbolProps {
  index: number;
  inactiveIcon: string | object | React.ReactElement;
  activeIcon: string | object | React.ReactElement;
  percent: number;
  readonly?: boolean;
  onClick?: (index: number, event: React.MouseEvent | React.TouchEvent) => void;
  onMouseMove?: (index: number, event: React.MouseEvent | React.TouchEvent) => void;
  onTouchEnd?: (index: number, event: React.TouchEvent) => void;
}

// Return the corresponding React node for an icon.
function _iconNode(icon: RatingSymbolProps["inactiveIcon"] | RatingSymbolProps["activeIcon"]) {
  // If it is already a React Element just return it.
  if (React.isValidElement(icon)) {
    return icon;
  }
  // If it is an object, try to use it as a CSS style object.
  if (typeof icon === "object" && icon !== null) {
    return <span style={icon as CSSProperties} />;
  }
  // If it is a string, use it as class names.
  if (Object.prototype.toString.call(icon) === "[object String]") {
    return <span className={icon} />;
  }

  // Otherwise, this is an invalid icon node.
  throw new Error("Invalid icon node.");
}

export const RatingSymbol: React.FC<RatingSymbolProps> = ({
  index,
  inactiveIcon,
  activeIcon,
  percent,
  readonly = false,
  onClick,
  onMouseMove,
  onTouchEnd,
}) => {
  const [touchMoved, setTouchMoved] = useState(false);

  const backgroundNode = _iconNode(inactiveIcon);
  const showbgIcon = percent < 100;
  const bgIconContainerStyle: CSSProperties = showbgIcon ? {} : { visibility: "hidden" };
  const iconNode = _iconNode(activeIcon);
  const iconContainerStyle: CSSProperties = {
    display: "inline-block",
    position: "absolute",
    overflow: "hidden",
    top: 0,
    width: `${percent}%`,
  };
  const style: CSSProperties = {
    cursor: !readonly ? "pointer" : "inherit",
    display: "inline-block",
    position: "relative",
  };

  function handleMouseMove(e: React.MouseEvent | React.TouchEvent) {
    if (onMouseMove) {
      onMouseMove(index, e);
    }
  }

  function handleMouseClick(e: React.MouseEvent | React.TouchEvent) {
    if (onClick && !touchMoved) {
      onClick(index, e);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && onClick) {
      onClick(index, e as any);
    }
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (onTouchEnd && !touchMoved) {
      onTouchEnd(index, e);
    }
  }

  function handleTouchMove() {
    setTouchMoved(true);
  }

  return (
    <span
      role="button"
      style={style}
      onClick={handleMouseClick}
      onKeyDown={handleKeyDown}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      tabIndex={index}
    >
      <span style={bgIconContainerStyle}>{backgroundNode}</span>
      <span style={iconContainerStyle}>{iconNode}</span>
    </span>
  );
};
