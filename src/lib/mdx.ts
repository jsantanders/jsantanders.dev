import rehypePrism from "@mapbox/rehype-prism";
import rehypeToc, { Toc } from "@stefanprobst/rehype-extract-toc";
import rehypeTocExport from "@stefanprobst/rehype-extract-toc/mdx";
import fs from "fs";
import { readdir } from "fs/promises";
import matter from "gray-matter";
import { bundleMDX } from "mdx-bundler";
import { getMDXExport } from "mdx-bundler/client";
import path from "path";
import readingTime from "reading-time";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import remarkMath from "remark-math";
import remarkPrism from "remark-prism";

import type { Frontmatter, Information } from "@/components/Post";
import rehypeImageMetadata from "@/lib/rehype-image-metadata";

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
 * @returns {Promise<MDXBundler>} Blog post bundle
 */
export const bundleBlogPost = async (slug: string, locale?: string): Promise<MDXBundler> => {
  const remarkPlugins = [remarkPrism, remarkMath];
  const rehypePlugins = [
    rehypePrism,
    rehypeImageMetadata,
    rehypeKatex,
    rehypeSlug,
    rehypeToc,
    rehypeTocExport,
  ];
  return await bundleMDX({
    file: path.join(
      process.cwd(),
      "blogs",
      slug,
      `index${locale !== "en" ? `.${locale}` : ""}.mdx`
    ),
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
    globals: { Mafs: "Mafs" },
    cwd: path.join(process.cwd(), "blogs", slug),
  });
};

/**
 * Gets the table of contents of a blog post
 * @param {string} code - blog raw code
 * @returns {Toc} Table of contents
 **/
export const getTableOfContents = (code: string): Toc => {
  const mdxExport = getMDXExport(code);
  return mdxExport.tableOfContents;
};
