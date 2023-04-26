/* eslint-disable require-jsdoc */
import matter from "gray-matter";
import type { GetStaticPaths, GetStaticPathsResult, GetStaticProps } from "next";
import readingTime from "reading-time";

import { Blog as BlogPostProps, BlogPost } from "@/components/BlogPost";
import { bundleBlogPost, getBlogBySlug, getBlogSlugs } from "@/utils/mdx";

/**
 * Renders the blog post page
 * @param {BlogPostProps} props the blog post props
 * @returns {React.ReactElement} React component
 */
const Blog: React.FC<BlogPostProps> = (props) => {
  return <BlogPost {...props} />;
};

/** Next.js function to get the static props
 * @param {GetStaticPropsContext} context - Context
 * @returns {Promise<GetStaticPropsResult<StaticProps>>} Promise of static props
 **/
export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  if (params?.slug && typeof params.slug === "string") {
    const language = await import(`../../locales/${locale}.json`);

    const { code, frontmatter, matter } = await bundleBlogPost(params.slug, locale);

    return {
      props: {
        code,
        frontmatter,
        readingTime: readingTime(matter.content),
        lngDict: language.default,
      },
    };
  }

  return {
    notFound: true,
  };
};

/**
 * Next.js function to get the static paths
 * @returns {Promise<GetStaticPathsResult>} Promise of static paths
 */
export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
  const blogSlugs = await getBlogSlugs();

  const paths: GetStaticPathsResult["paths"] = [];
  locales?.forEach((locale) => {
    blogSlugs.forEach((slug) => {
      const source = getBlogBySlug(slug, locale);
      const { data } = matter(source.trim());
      if (data.isPublished) {
        paths.push({
          params: {
            slug,
          },
          locale: locale,
        });
      }
    });
  });

  return {
    paths,
    fallback: false,
  };
};

export default Blog;
