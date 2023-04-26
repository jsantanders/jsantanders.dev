/* eslint-disable no-console */
import dotenv from "dotenv";
import fs from "fs";
import matter from "gray-matter";
import fetch from "node-fetch";
import path from "path";

dotenv.config({ path: path.join(__dirname, "..", ".env.publish.local") });

/**
 * Generate a blog object from a slug
 * @param {string} slug the slug of the blog
 * @returns {Record<string, unknown>} the blog object
 */
const generateBlog = (slug: string): Record<string, unknown> => {
  const source = fs.readFileSync(path.join(__dirname, "..", "blogs", `${slug}.mdx`), "utf8");
  const { data, content } = matter(source.trim());
  const canonicalUrl =
    data.locale === "en"
      ? `https://jsantanders.dev/blog/${slug}`
      : `https://jsantanders.dev/es/blog/${slug}`;

  return {
    ...data,
    canonicalUrl,
    content: replaceRelativePath(content),
  };
};

/**
 * Replace relative path to absolute path
 * @param {string} content the content of the blog
 * @returns {string} the content with absolute path
 */
const replaceRelativePath = (content: string): string => {
  const withoutRelativeImage = content.replace(
    /\]\(\/images(?!https?:\/\/)/gi,
    "](" + "https://jsantanders.dev/images"
  );
  return withoutRelativeImage.replace(/\]\((?!https?:\/\/)/gi, "](" + "https://jsantanders.dev");
};

(async () => {
  if (process.argv.length !== 3) {
    console.log("Should only have 1 argument");
    process.exit(1);
  }

  const slug = process.argv[2];
  const exist = fs
    .readdirSync(path.join(__dirname, "..", "blogs"))
    .find((b) => b === `${slug}.mdx`);

  if (!exist) {
    console.log(`${slug} article does not exist`);
    process.exit(1);
  }

  const blog = generateBlog(slug || "");

  // Dev.to API
  fetch("https://dev.to/api/articles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": process.env.DEV_TOKEN as string,
    },
    body: JSON.stringify({
      article: {
        title: blog.title,
        body_markdown: blog.content,
        description: blog.description,
        tags: blog.tags,
        canonical_url: blog.canonicalUrl,
      },
    }),
  })
    .then((res) => res.json())
    .then((data: any) => {
      if (data.error) {
        console.log("Dev.to:", data.error);
      } else {
        console.log("Dev.to: Success in publishing the draft article at https://dev.to/dashboard");
      }
    })
    .catch((error) => console.log(error));
})();
