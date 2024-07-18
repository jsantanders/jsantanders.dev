import { Information } from "@/types/information";
import { readdir } from "fs/promises";
import readingTime from "reading-time";
import matter from "gray-matter";
import fs from "fs";
import path from "path";
import { bundleMDX } from "mdx-bundler";
import { Frontmatter } from "@/types/frontmatter";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import rehypePrism from "rehype-prism-plus";
import rehypeToc, { Toc } from "@stefanprobst/rehype-extract-toc";
import rehypeTocExport from "@stefanprobst/rehype-extract-toc/mdx";
import remarkGfm from "remark-gfm";
//@ts-ignore
import rehypeMdxImportMedia from "rehype-mdx-import-media";
import rehypeSlug from "rehype-slug";
import { getMDXExport } from "mdx-bundler/client";

const POSTS_FOLDER_NAME = "posts";
type MDXBundler = ReturnType<typeof bundleMDX>;

export const getTableOfContents = (code: string): Toc => {
  const mdxExport = getMDXExport(code);
  return mdxExport.tableOfContents;
};

export const getPostsSlugs = async (): Promise<string[]> => {
  try {
    return (await getPostsDirs()).map((dir) => getSlugInfoFromDir(dir)).map((info) => info.slug);
  } catch (error) {
    console.error(`unable to get the blog slugs, ${error}`);
    throw error;
  }
};

export const getPostsInformation = async (
  locale: string,
  limit?: number
): Promise<Information[]> => {
  const postsDir = await getPostsDirs();
  let to = postsDir.length;
  if (limit !== undefined && limit < to) to = limit;

  return postsDir
    .map((dir): Information => {
      const source = getPostRawData(dir, locale);
      const { data, content } = matter(source.trim());
      const { slug, date } = getSlugInfoFromDir(dir);

      return {
        ...(data as Frontmatter),
        slug,
        publishedAt: date,
        readingTime: readingTime(content),
      };
    })
    .filter((post) => post.isPublished)
    .sort((a, b) => Number(new Date(b.publishedAt)) - Number(new Date(a.publishedAt)))
    .slice(0, to);
};
export const bundleBlogPost = async (slug: string, locale?: string): Promise<MDXBundler> => {
  // Be carefull, order matters.
  const remarkPlugins = [remarkGfm, remarkMath];

  // Be carefull, order matters.
  const rehypePlugins = [
    rehypeKatex,
    rehypePrism,
    rehypeSlug,
    rehypeToc,
    rehypeTocExport,
    rehypeMdxImportMedia,
  ];
  const postsMeta = (await getPostsDirs()).map((dir) => getSlugInfoFromDir(dir));
  const meta = postsMeta.find((m) => m.slug === slug);
  const dir = `${meta?.date}--${meta?.slug}`;

  const bundle = await bundleMDX({
    file: path.join(
      process.cwd(),
      POSTS_FOLDER_NAME,
      dir,
      `index${locale !== "en" ? `.${locale}` : ""}.mdx`
    ),
    mdxOptions(options) {
      options.remarkPlugins = [...(options.remarkPlugins ?? []), ...remarkPlugins];
      options.rehypePlugins = [...(options.rehypePlugins ?? []), ...rehypePlugins];
      return options;
    },
    esbuildOptions(options) {
      options.loader = {
        ...options.loader,
        // Still allow inlining SVGs since they are rare & small.
        ".svg": "dataurl",
        ".png": "file",
        ".jpeg": "file",
        ".jpg": "file",
      };
      options.outdir = `./public/images/posts/${slug}`;
      options.publicPath = `/images/posts/${slug}`;
      options.write = true;

      return options;
    },
    globals: { Mafs: "Mafs" },
    cwd: process.cwd(),
  });

  // Since date is not on the frontmatter but in the post folder name
  // I'm adding it after the bundle.
  bundle.frontmatter.publishedAt = meta?.date;
  return bundle;
};

const getPostsDirs = async (): Promise<string[]> => {
  try {
    const dirs = await readdir(path.join(process.cwd(), POSTS_FOLDER_NAME));
    //filters hidden files. (I'm looking to you .DS_Store)
    return dirs.filter((item) => !/(^|\/)\.[^/.]/g.test(item));
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getPostRawData = (dir: string, locale: string) => {
  try {
    const langKey = locale !== "en" ? `.${locale}` : "";
    return fs.readFileSync(
      path.join(process.cwd(), POSTS_FOLDER_NAME, dir, `index${langKey}.mdx`),
      "utf8"
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getSlugInfoFromDir = (dir: string) => {
  const isDate = (dt: any) => String(new Date(dt)) !== "Invalid Date";
  try {
    const dateAndSlug = dir.split("--");
    if (dateAndSlug.length < 2) {
      throw Error(`invalid post folder format ${dir}. it should be yyyy-mm-dd--title-of-the-post`);
    }
    if (dateAndSlug[0] === undefined || !isDate(dateAndSlug[0])) {
      throw Error(`invalid date. it should be yyyy-mm-dd`);
    }
    if (dateAndSlug[1] === undefined) {
      throw Error(`invalid or empty post title`);
    }
    return { date: dateAndSlug[0], slug: dateAndSlug[1] };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
