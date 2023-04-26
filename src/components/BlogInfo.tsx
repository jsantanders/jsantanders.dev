import { BlogLink } from "@/components/BlogLink";
import { Information } from "@/components/BlogPost";
import { BlogRow } from "@/components/BlogRow";

/**
 * Render the blog information
 * @param {Information} props The component props
 * @returns {React.ReactElement} The component
 */
export const BlogInfo: React.FC<Information> = ({
  title,
  description,
  tags,
  slug,
  readingTime,
  publishedAt,
}) => {
  return (
    <BlogLink href={`/blog/${slug}`}>
      <div className="w-full">
        <h2 className="mb-2 px-1 text-2xl font-bold">{title}</h2>
        <p className="xs:line-clamp-4 mb-6 px-1 text-gray-600 dark:text-gray-400 lg:line-clamp-2">
          {description}
        </p>
        <BlogRow tags={tags} publishedAt={publishedAt} readingTime={readingTime} />
      </div>
    </BlogLink>
  );
};
