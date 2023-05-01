/* eslint-disable require-jsdoc */
import { useCallback, useEffect, useState } from "react";

import Star from "@/icons/star.svg";

import { RatingSymbol } from "./RatingSymbol";

type RatingProps = {
  readonly?: boolean;
  value: number;
  fractions?: number;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  tabIndex?: number;
  onHover?: (value?: number) => void;
  onClick?: (value: number, event: React.MouseEvent | React.TouchEvent) => void;
};

/**
 * Rating star system
 * @param {RatingProps} props The component props
 * @returns {React.ReactElement} The component
 */
export const Rating: React.FC<RatingProps> = ({
  readonly = false,
  value = 0,
  fractions = 1,
  className,
  id,
  style,
  tabIndex,
  onHover,
  onClick,
}: RatingProps) => {
  const [displayValue, setDisplayValue] = useState<number>(value);
  const totalSymbols = 5;

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  const onMouseLeave = useCallback(() => {
    setDisplayValue(value);
    onHover?.();
  }, [onHover, value]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const calculateHoverPercentage = useCallback((event: any) => {
    const clientX =
      event.nativeEvent.type.indexOf("touch") > -1
        ? event.nativeEvent.type.indexOf("touchend") > -1
          ? event.changedTouches[0].clientX
          : event.touches[0].clientX
        : event.clientX;

    const targetRect = event.currentTarget.getBoundingClientRect();
    const delta = clientX - targetRect.left;

    return delta < 0 ? 0 : delta / targetRect.width;
  }, []);

  const calculateDisplayValue = useCallback(
    (symbolIndex: number, event: React.MouseEvent | React.TouchEvent) => {
      const percentage = calculateHoverPercentage(event);
      const fraction = Math.ceil((percentage % 1) * fractions) / fractions;
      const precision = 10 ** 3;
      let calculatedValue =
        symbolIndex + (Math.floor(percentage) + Math.floor(fraction * precision) / precision);
      calculatedValue =
        calculatedValue > 0
          ? calculatedValue > totalSymbols
            ? totalSymbols
            : calculatedValue
          : 1 / fractions;
      return calculatedValue;
    },
    [calculateHoverPercentage, fractions]
  );
  const symbolClick = useCallback(
    (symbolIndex: number, event: React.MouseEvent | React.TouchEvent) => {
      const calculatedValue = calculateDisplayValue(symbolIndex, event);
      onClick?.(calculatedValue, event);
    },
    [calculateDisplayValue, onClick]
  );

  const symbolEnd = useCallback(
    (symbolIndex: number, event: React.MouseEvent | React.TouchEvent) => {
      symbolClick(symbolIndex, event);
      event.preventDefault();
      onMouseLeave();
    },
    [onMouseLeave, symbolClick]
  );

  const symbolMouseMove = useCallback(
    (symbolIndex: number, event: React.MouseEvent | React.TouchEvent) => {
      const calculatedValue = calculateDisplayValue(symbolIndex, event);
      setDisplayValue(calculatedValue);
      onHover?.(calculatedValue);
    },
    [calculateDisplayValue, onHover]
  );

  const symbolNodes = [];
  const renderedValue = displayValue;

  const fullSymbols = Math.floor(renderedValue);

  for (let i = 0; i < totalSymbols; i++) {
    let percent;
    // Calculate each symbol's fullness percentage
    if (i - fullSymbols < 0) {
      percent = 100;
    } else if (i - fullSymbols === 0) {
      percent = (renderedValue - i) * 100;
    } else {
      percent = 0;
    }

    symbolNodes.push(
      <RatingSymbol
        key={i}
        index={i}
        readonly={readonly}
        inactiveIcon={<Star className="h-10 w-10 text-gray-400" />}
        activeIcon={<Star className="h-10 w-10 text-yellow-500" />}
        percent={percent}
        {...(!readonly && {
          onClick: symbolClick,
          onMouseMove: symbolMouseMove,
          onTouchMove: symbolMouseMove,
          onTouchEnd: symbolEnd,
        })}
      />
    );
  }

  return (
    <span
      id={id}
      style={{ ...style, display: "inline-block" }}
      className={className}
      tabIndex={tabIndex}
      {...(!readonly && {
        onMouseLeave: onMouseLeave,
      })}
    >
      {symbolNodes}
    </span>
  );
};
