import { PropsWithChildren } from "react";

/**
 * A wrapper for Mafs that adds a border and padding
 * @param {PropsWithChildren<MafsProps>} props The component props
 * @returns {React.ReactElement} The component
 */
export function Box(props: PropsWithChildren) {
  return (
    <span className="inline-block w-full rounded-xl border border-solid border-gray-200 p-2 dark:border-gray-800 md:p-4">
      {props.children}
    </span>
  );
}
