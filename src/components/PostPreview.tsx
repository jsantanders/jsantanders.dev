import NextLink from "next/link";

import { Information } from "@/components/Post";
import { PostMeta } from "@/components/PostMeta";

type BlogLinkProps = React.PropsWithChildren<{
  href: string;
}>;

/**
 * Render a link to a blog post
 * @param {BlogLinkProps} props The component props
 * @returns {React.ReactElement} The component
 */
export const PostLink: React.FC<BlogLinkProps> = ({ children, href }) => {
  return (
    <NextLink href={href}>
      <div
        aria-label=""
        className="mb-8 w-full max-w-xl rounded-md border border-solid border-primary p-4 focus:outline-none focus:ring-2 dark:border-primary"
      >
        {children}
      </div>
    </NextLink>
  );
};

/**
 * Render the blog information
 * @param {Information} props The component props
 * @returns {React.ReactElement} The component
 */
export const PostPreview: React.FC<Information> = ({
  title,
  description,
  tags,
  slug,
  readingTime,
  publishedAt,
}) => {
  return (
    <PostLink href={`/blog/${slug}`}>
      <div className="w-full">
        <h2 className="mb-2 px-1 text-2xl font-bold">{title}</h2>
        <p className="xs:line-clamp-4 mb-6 px-1 text-gray-600 dark:text-gray-400 lg:line-clamp-2">
          {description}
        </p>
        <PostMeta tags={tags} publishedAt={publishedAt} readingTime={readingTime} />
      </div>
    </PostLink>
  );
};
