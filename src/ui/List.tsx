export type ListProps = {
  type: "ol" | "ul";
};

/**
 * Renders a wrapper for ordered and unordered lists.
 * @param {ListProps} props component props
 * @returns {React.ReactElement} React component
 */
export const List: React.FC<ListProps> = ({ type, ...props }) => {
  let classes;
  const Component = type as React.ElementType;

  switch (type) {
    case "ol":
      classes = "ordered";
      break;
    case "ul":
      classes = "unordered";
      break;
    default:
      break;
  }

  return <Component className={`${classes} my-5`} {...props} />;
};
