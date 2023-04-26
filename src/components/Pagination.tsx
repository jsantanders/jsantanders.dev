type PaginationProps = {
  currentPage: number;
  itemsCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
};

/**
 * @component Pagination - Simple pagination component
 * @param {IPaginationProps} props the component props
 * @returns {ReactElement} The component
 */
export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  itemsCount,
  pageSize,
  onPageChange,
}) => {
  const pagesCount = Math.ceil(itemsCount / pageSize);
  const pages = Array.from({ length: pagesCount }, (_, i) => i + 1);

  return (
    <nav aria-label="Blog Page navigation">
      <ul className="inline-flex items-center -space-x-px">
        <li>
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            type="button"
            className="ml-0 block rounded-l-lg border border-gray-400 bg-white px-3 py-2 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <span className="sr-only">Previous</span>
            <svg
              aria-hidden="true"
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </li>

        {pages.map((page) => (
          <li key={page}>
            <button
              type="button"
              onClick={() => onPageChange(page)}
              className={page === currentPage ? styles.selected : styles.unselected}
            >
              {page}
            </button>
          </li>
        ))}

        <li>
          <button
            disabled={currentPage === pagesCount}
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            className="block rounded-r-lg border border-gray-400 bg-white px-3 py-2 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <span className="sr-only">Next</span>
            <svg
              aria-hidden="true"
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </li>
      </ul>
    </nav>
  );
};

const styles = {
  unselected:
    "px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white",
  selected:
    "z-10 px-3 py-2 leading-tight text-gray-600 border border-gray-400 bg-gray-50 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white",
};
