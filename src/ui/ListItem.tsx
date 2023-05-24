/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef, useState } from "react";

import ListArrow from "@/icons/list-arrow.svg";

export type ListItemProps = React.PropsWithChildren<React.HTMLAttributes<HTMLLIElement>>;

/**
 * Renders a wrapper for ordered and unordered lists items.
 * @param {ListItemProps} props component props
 * @returns {React.ReactElement} React component
 */
export const ListItem: React.FC<ListItemProps> = ({ children, ...props }) => {
  const listRef = useRef<any>();
  const [type, setType] = useState<string>("");

  useEffect(() => {
    setType(listRef?.current?.parentElement.nodeName.toLowerCase());
  }, [listRef]);

  return (
    <li ref={listRef} className="flex flex-row items-baseline" {...props}>
      {type === "ul" && (
        <span className="min-w-40 translate-y-1 transform pr-3 text-orange" aria-hidden>
          <ListArrow width={18} height={18} />
        </span>
      )}
      <span className="text-2md">{children}</span>
    </li>
  );
};
