export type DivisionProps = React.PropsWithChildren<{
  className: string;
}>;

export const Division: React.FC<DivisionProps> | React.ReactNode = (
  props: DivisionProps
): React.ReactElement => {
  const isRemarkHighlight = props.className === "remark-highlight";

  if (isRemarkHighlight) {
    return <>{props.children}</>;
  }

  return <div {...props} />;
};
