export type DivisionProps = React.PropsWithChildren<{
  className: string;
}>;

/**
 * This component renders a division line.
 * @param {DivisionProps} props component props.
 * @returns {React.ReactElement} React component.
 */
export const Division: React.FC<DivisionProps> | React.ReactNode = (
  props: DivisionProps
): React.ReactElement => {
  const isRemarkHighlight = props.className === "remark-highlight";

  if (isRemarkHighlight) {
    return <>{props.children}</>;
  }

  return <div {...props} />;
};
