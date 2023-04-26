import NextLink from "next/link";

type BlogLinkProps = React.PropsWithChildren<{
  href: string;
}>;

/**
 * Render a link to a blog post
 * @param {BlogLinkProps} props The component props
 * @returns {React.ReactElement} The component
 */
export const BlogLink: React.FC<BlogLinkProps> = ({ children, href }) => {
  return (
    <NextLink href={href}>
      <div
        aria-label=""
        className="mb-8 w-full max-w-xl rounded-md border border-solid border-gray-200 p-4 focus:outline-none focus:ring-2 dark:border-gray-800"
      >
        {children}
      </div>
    </NextLink>
  );
};
