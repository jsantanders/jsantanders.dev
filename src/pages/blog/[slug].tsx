/* eslint-disable require-jsdoc */
import matter from "gray-matter";
import type { GetStaticPaths, GetStaticPathsResult, GetStaticProps } from "next";
import readingTime from "reading-time";

import { Container } from "@/components/Container";
import { Post, PostProps } from "@/components/Post";
import { bundleBlogPost, getBlogBySlug, getBlogSlugs, getTableOfContents } from "@/lib/mdx";

/**
 * Renders the blog post page
 * @param {PostProps} props the blog post props
 * @returns {React.ReactElement} React component
 */
const Blog: React.FC<PostProps> = (props) => {
  const seo = {
    type: "article",
    imageAlt: props.frontmatter.title,
    ...props.frontmatter,
  };

  return (
    <Container seo={seo as unknown as { [key: string]: string }}>
      <Post {...props} />
    </Container>
  );
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
        slug: params.slug,
        lngDict: language.default,
        tableOfContents: getTableOfContents(code),
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
