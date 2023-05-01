import clsx from "clsx";

/**
 * Renders a list of tags
 * @param {Array} tags - Tags
 * @returns {React.ReactElement} The component
 */
export const Tag: React.FC<{
  name: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ name, isActive, onClick }) => {
  const tagStyle = isActive
    ? "border-gray-200 dark:bg-gray-100 bg-gray-800 text-gray-100 dark:border-gray-800 dark:text-gray-800"
    : "hover:bg-secondary hover:text-primary focus:outline-none focus-visible:bg-secondary focus-visible:text-primary border-gray-200 bg-primary text-gray-800 dark:border-gray-800 dark:text-gray-400";
  return (
    <button className="py-2 lg:py-1.5" onClick={onClick}>
      <span
        className={clsx(
          "mr-2 rounded border px-2.5 py-1 text-sm font-medium  focus:outline-none focus:ring-2",
          tagStyle
        )}
      >
        {name}
      </span>
    </button>
  );
};
