/* eslint-disable @typescript-eslint/no-explicit-any */

import NextImage from "next/image";

/**
 * Renders an image with a border.
 * @param {ImageProps} props component props
 * @returns {React.ReactElement} React component
 */
export const Image: React.FC<any> = (props) => {
  return (
    <span className="flex items-center justify-center">
      <span className="rounded-xl border border-solid border-gray-200 p-2 dark:border-gray-800 md:p-4">
        <NextImage className="rounded-lg" {...props} />
      </span>
    </span>
  );
};
