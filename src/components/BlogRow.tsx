import { useRouter } from "next/router";

import { useI18n } from "next-localization";
import type { IReadTimeResults } from "reading-time";

import formatDate from "@/utils/date";

type BlogRowProps = {
  tags: string[];
  publishedAt: string;
  readingTime: IReadTimeResults;
};

/**
 * Render a row with the blog information
 * @param {BlogRowProps} props The component props
 * @returns {React.ReactElement} The component
 */
export const BlogRow: React.FC<BlogRowProps> = ({ tags, publishedAt, readingTime }) => {
  const router = useRouter();
  const i18n = useI18n();

  const isEN = router?.locale === "en";

  return (
    <div className="flex flex-col justify-between md:flex-row md:items-center">
      <div className="flex flex-row">
        {tags.map((tag) => (
          <p key={tag} className="p-1 text-sm text-gray-500 dark:text-gray-500">
            <span className="text-gray-400 dark:text-gray-600">#</span>
            {tag}
          </p>
        ))}
      </div>
      <div className="flex flex-row">
        <p className="p-1 text-xs text-gray-500">
          {i18n.t("blog.published")} {formatDate(isEN ? "en-US" : "es", new Date(publishedAt))}
        </p>
        <span className="text-gray-500">·</span>
        <p className="p-1 text-xs text-gray-500">
          {Math.ceil(readingTime.minutes).toFixed(0)}
          {i18n.t("blog.read")}
        </p>
      </div>
    </div>
  );
};
