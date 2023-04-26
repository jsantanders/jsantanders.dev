import { useState } from "react";

import type { GetStaticProps } from "next";
import { useI18n } from "next-localization";

import { BlogInfo } from "@/components/BlogInfo";
import type { Information } from "@/components/BlogPost";
import { Container } from "@/components/Container";
import { Pagination } from "@/components/Pagination";
import { getBlogsInformation } from "@/utils/mdx";

/**
 * Renders the blog page
 * @param {Information[]} blogs - Blogs information
 * @returns {React.ReactElement} React component
 */
const Blog: React.FC<{ blogs: Information[] }> = ({ blogs }) => {
  const i18n = useI18n();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = Number(process.env.NEXT_PUBLIC_PAGE_SIZE) || 3;
  const from = (currentPage - 1) * pageSize;
  const to = from + pageSize;
  const totalPage = Math.ceil(blogs.length / pageSize);

  return (
    <Container seo={i18n.t("blog.seo") as unknown as { [key: string]: string }}>
      <h1 className="my-8 text-3xl font-bold sm:text-5xl">{i18n.t("blog.title")}</h1>
      {!blogs.length && <p className="mb-4 text-2xl text-gray-400">{i18n.t("blog.none")}</p>}
      {blogs.slice(from, to).map((info) => (
        <BlogInfo key={info.slug} {...info} />
      ))}
      {totalPage > 1 && (
        <div className="mb-6 mt-6 flex gap-6">
          <Pagination
            currentPage={currentPage}
            pageSize={pageSize}
            itemsCount={blogs.length}
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

  return {
    props: {
      lngDict: language.default,
      blogs,
    },
  };
};

export default Blog;
