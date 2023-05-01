import { useState } from "react";

import type { GetStaticProps } from "next";
import { useI18n } from "next-localization";

import { Container } from "@/components/Container";
import { Pagination } from "@/components/Pagination";
import type { Information } from "@/components/Post";
import { PostPreview } from "@/components/PostPreview";
import { Tag } from "@/components/Tag";
import { getBlogsInformation } from "@/lib/mdx";

/**
 * Renders the blog page
 * @param {Information[]} blogs - Blogs information
 * @returns {React.ReactElement} React component
 */
const Blogs: React.FC<{ blogs: Information[]; tags: string[] }> = ({ blogs, tags }) => {
  const i18n = useI18n();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const filteredBlogs = blogs.filter((blog) => {
    if (selectedTags.length === 0) {
      return true;
    }
    return blog.tags.some((tag) => selectedTags.includes(tag));
  });
  const pageSize = Number(process.env.NEXT_PUBLIC_PAGE_SIZE) || 3;
  const from = (currentPage - 1) * pageSize;
  const to = from + pageSize;
  const totalPage = Math.ceil(filteredBlogs.length / pageSize);

  return (
    <Container seo={i18n.t("blog.seo") as unknown as { [key: string]: string }}>
      <h1 className="my-8 text-3xl font-bold sm:text-5xl">{i18n.t("blog.title")}</h1>
      {!blogs.length && (
        <p className="mb-4 text-2xl text-gray-600 dark:text-gray-400">{i18n.t("blog.none")}</p>
      )}

      <p className="text-md mb-4 mt-4 text-gray-600 dark:text-gray-400">{i18n.t("blog.tag")}</p>

      <ul className="mb-6 flex max-w-xl flex-wrap items-center justify-center">
        {tags.map((tag) => (
          <li key={tag}>
            <Tag
              name={tag}
              isActive={selectedTags.includes(tag)}
              onClick={() =>
                setSelectedTags((prev) =>
                  prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
                )
              }
            />
          </li>
        ))}
      </ul>

      {filteredBlogs.slice(from, to).map((info) => (
        <PostPreview key={info.slug} {...info} />
      ))}
      {totalPage > 1 && (
        <div className="mb-6 mt-6 flex gap-6">
          <Pagination
            currentPage={currentPage}
            pageSize={pageSize}
            itemsCount={filteredBlogs.length}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}
    </Container>
  );
};

/** Next.js function to get the static props
 * @param {GetStaticPropsContext} context - Context
 * @returns {Promise<GetStaticPropsResult<StaticProps>>} Promise of static props
 **/
export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const language = await import(`@/locales/${locale}.json`);
  const blogs = await getBlogsInformation(locale);
  const tags = [...new Set(blogs.flatMap((blog) => blog.tags))];

  return {
    props: {
      lngDict: language.default,
      blogs,
      tags,
    },
  };
};

export default Blogs;
