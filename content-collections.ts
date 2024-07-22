import { exec as syncExec } from "node:child_process";
import path from "node:path";
import { promisify } from "node:util";
import fsp from "node:fs/promises";
import readingTime from "reading-time";
import staticImages, { staticCoverImage } from "./lib/static-images";
import resolveImageBlurDataURL from "./lib/image-blur-data-url";
import { defineCollection, defineConfig } from "@content-collections/core";
import rehypeKatex from "rehype-katex";
import rehypePresetMinify from "rehype-preset-minify";
import remarkMath from "remark-math";
import rehypePrism from "rehype-prism-plus";
import remarkConvertInlineFootnotes from "./lib/remark-convert-inline-footnote";
import rehypeToc from "@stefanprobst/rehype-extract-toc";
import rehypeTocExport from "@stefanprobst/rehype-extract-toc/mdx";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeCitation from "rehype-citation";
import { compileMDX } from "@content-collections/mdx";
import withoutBody from "./lib/without-body";
import searchIndex from "./lib/search-index";
import { sha256 } from "./lib/utils";

const exec = promisify(syncExec);
const POST_DIRECTORY = "content/posts";
type ImageParams = { image: string; directory: string };

function calculateReadingTime(content: string) {
  const contentWithoutSvg = content.replace(/<svg+.+?(?=<\/svg>)<\/svg>/gs, "");
  return readingTime(contentWithoutSvg).minutes.toFixed(0);
}

function extractLocale(filePath: string) {
  // Regular expression to match common locale patterns
  const localeRegex = /index\.([a-z]{2})\.mdx$/i;
  const match = filePath.match(localeRegex);

  // Check if a locale was found, otherwise default to 'en'
  if (match && match.length > 1) {
    return match[1];
  }
  return "en"; // Default to English if not found
}

const getSlugAndDateFromDir = (dir: string) => {
  const isDate = (dt: string) => String(new Date(dt)) !== "Invalid Date";

  const dateAndSlug = dir.split("--");
  if (dateAndSlug.length < 2) {
    throw Error(
      `invalid post folder format ${dir}. it should be yyyy-mm-dd--title-of-the-post`,
    );
  }
  if (dateAndSlug[0] === undefined || !isDate(dateAndSlug[0])) {
    throw Error("invalid date. it should be yyyy-mm-dd");
  }
  if (dateAndSlug[1] === undefined) {
    throw Error("invalid or empty post title");
  }
  return { date: dateAndSlug[0], slug: dateAndSlug[1] };
};

async function lastModificationDate(filePath: string) {
  const { stdout } = await exec(
    `git log -1 --format=%ai -- ${path.join(POST_DIRECTORY, filePath)}`,
  );
  if (stdout) {
    return new Date(stdout.trim()).toISOString();
  }
  return new Date().toISOString();
}

async function doesFileExist(path: string) {
  try {
    return (await fsp.stat(path)).isFile();
  } catch (e) {
    return false;
  }
}

async function collectImageInformation({ image, directory }: ImageParams) {
  const url = await staticCoverImage(
    POST_DIRECTORY,
    "public/posts",
    "/posts",
    directory,
    image,
  );
  const blurDataURL = await resolveImageBlurDataURL(
    POST_DIRECTORY,
    directory,
    image,
  );
  return { url, blurDataURL };
}

const posts = defineCollection({
  name: "posts",
  directory: POST_DIRECTORY,
  include: "*/**.mdx",
  schema: (z) => ({
    title: z.string(),
    summary: z.string(),
    isPublished: z.boolean(),
    tags: z.array(z.string()),
  }),
  transform: async (post, ctx) => {
    const locale = extractLocale(post._meta.filePath);
    const dir = path.join(process.cwd(), POST_DIRECTORY, post._meta.directory);
    const hasReferences = await doesFileExist(path.join(dir, "references.bib"));

    const mdx = await compileMDX(ctx, post, {
      files: (appender) => {
        const directory = path.join(
          POST_DIRECTORY,
          post._meta.directory,
          "components",
        );
        appender.directory("./components", directory);
      },
      rehypePlugins: [
        rehypeKatex,
        [
          rehypeCitation,
          {
            path: dir,
            bibliography: hasReferences
              ? path.join(dir, "references.bib")
              : undefined,
            linkCitations: true,
            csl: "https://raw.githubusercontent.com/citation-style-language/styles/master/acm-sig-proceedings.csl",
          },
        ],
        rehypePrism,
        rehypeSlug,
        rehypeToc,
        rehypeTocExport,
        [
          staticImages,
          {
            publicDir: path.join("public", "posts"),
            resourcePath: "/posts",
            sourceRoot: POST_DIRECTORY,
          },
        ],
        rehypePresetMinify,
      ],
      remarkPlugins: [remarkMath, remarkConvertInlineFootnotes, remarkGfm],
    });

    const lastModification = await ctx.cache(
      post._meta.filePath,
      lastModificationDate,
    );

    const { slug, date } = getSlugAndDateFromDir(post._meta.directory);
    const id = await sha256(`/${locale}/posts/${slug}`);
    return {
      ...post,
      content: {
        mdx,
        raw: post.content,
      },
      readingTime: calculateReadingTime(post.content),
      lastModification,
      locale,
      date,
      slug,
      id,
      url: `/posts/${slug}`,
    };
  },
  onSuccess: async (documents) => {
    await Promise.all([
      withoutBody(documents, ".generated"),
      searchIndex(documents, ".generated"),
    ]);
  },
});

export default defineConfig({
  collections: [posts],
});
