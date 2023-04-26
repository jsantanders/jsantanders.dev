import rehypePrism from "@mapbox/rehype-prism";
import fs from "fs";
import { readdir } from "fs/promises";
import matter from "gray-matter";
import { bundleMDX } from "mdx-bundler";
import path from "path";
import readingTime from "reading-time";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import remarkPrism from "remark-prism";

import type { Frontmatter, Information } from "@/components/BlogPost";
import imageMetadata from "@/utils/image-metadata-plugin";

type MDXBundler = ReturnType<typeof bundleMDX>;

/**
 * Get blog by slug
 * @param {string} slug - Slug of the blog
 * @param {string} locale - Locale of the blog
 * @returns {string} Blog content
 **/
export const getBlogBySlug = (slug: string, locale?: string): string => {
  const langKey = locale !== "en" ? `.${locale}` : "";
  return fs.readFileSync(path.join(process.cwd(), "blogs", slug, `index${langKey}.mdx`), "utf8");
};

/**
 * Return all blogs
 * @returns {Promise<string[]>} Array of blogs
 */
export const getBlogSlugs = async (): Promise<string[]> => {
  return await readdir(path.join(process.cwd(), "blogs"));
};

/**
 * Get all blogs information
 * @param {string} locale the locale (en, es)
 * @returns {Information[]} Array of blogs information
 */
export const getBlogsInformation = async (locale?: string): Promise<Information[]> => {
  const blogSlugs = await getBlogSlugs();

  return blogSlugs
    .map((slug): Information => {
      const source = getBlogBySlug(slug, locale);
      const { data, content } = matter(source.trim());

      return {
        ...(data as Frontmatter),
        slug,
        readingTime: readingTime(content),
      };
    })
    .filter((blog) => blog.isPublished)
    .sort((a, b) => Number(new Date(b.publishedAt)) - Number(new Date(a.publishedAt)));
};

/**
 * Generate blog post bundle from slug
 * @param {string} slug - Slug of the blog
 * @param {string} locale - Locale of the blog
 * @returns {Promise<string>} Blog post bundle
 */
export const bundleBlogPost = async (slug: string, locale?: string): Promise<MDXBundler> => {
  const remarkPlugins = [remarkPrism, remarkMath];
  const rehypePlugins = [rehypePrism, imageMetadata, rehypeKatex];
  return await bundleMDX({
    source: getBlogBySlug(slug, locale),
    // eslint-disable-next-line require-jsdoc
    mdxOptions(options) {
      options.remarkPlugins = [...(options.remarkPlugins ?? []), ...remarkPlugins] as never;
      options.rehypePlugins = [...(options.rehypePlugins ?? []), ...rehypePlugins] as never;
      return options;
    },
    // eslint-disable-next-line require-jsdoc
    esbuildOptions(options) {
      options.loader = {
        ...options.loader,
        // Still allow inlining SVGs since they are rare & small.
        ".svg": "dataurl",
      };

      return options;
    },
  });
};
