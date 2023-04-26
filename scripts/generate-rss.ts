/* eslint-disable no-console */
import fs from "fs";
import matter from "gray-matter";
import path from "path";
import RSS from "rss";

const OUTPUT_FILE_EN = path.resolve(__dirname, "..", "public", "en.feed.xml");
const OUTPUT_FILE_ES = path.resolve(__dirname, "..", "public", "es.feed.xml");

(async () => {
  const feedEN = new RSS({
    title: "Jesus Santander's Blog",
    description: "Personal blog about software engineering and math",
    site_url: "https://jasantanders.dev",
    feed_url: "https://jasantanders.dev/en.feed.xml",
    language: "en",
  });

  const feedES = new RSS({
    title: "Blog de Jesus Santander",
    description: "Blog personal de ingeniería de software y matemáticas",
    site_url: "https://jasantanders.dev/es",
    feed_url: "https://jasantanders.dev/es.feed.xml",
    language: "es",
  });

  const blogSlugs = fs.readdirSync(path.join(__dirname, "..", "blogs"));

  blogSlugs
    .map(
      (
        slug
      ): {
        [key: string]: string | boolean;
      } => {
        const source = fs.readFileSync(
          path.join(__dirname, "..", "blogs", slug, "index.mdx"),
          "utf8"
        );
        const { data } = matter(source);
        return { ...data, slug };
      }
    )
    .filter((blog) => blog.isPublished)
    .sort(
      (a, b) =>
        Number(new Date(b.publishedAt as string)) - Number(new Date(a.publishedAt as string))
    )
    .forEach((blog) => {
      feedEN.item({
        title: blog.title,
        url: `https://jasantanders.dev/blog/${blog.slug}`,
        description: blog.description,
        categories: blog.tags,
        author: "Jesus Santander",
        date: blog.publishedAt,
      });
    });

  blogSlugs
    .map(
      (
        slug
      ): {
        [key: string]: string | boolean;
      } => {
        const source = fs.readFileSync(
          path.join(__dirname, "..", "blogs", slug, "index.es.mdx"),
          "utf8"
        );
        const { data } = matter(source);
        return { ...data, slug };
      }
    )
    .filter((blog) => blog.isPublished)
    .sort(
      (a, b) =>
        Number(new Date(b.publishedAt as string)) - Number(new Date(a.publishedAt as string))
    )
    .forEach((blog) => {
      feedES.item({
        title: blog.title,
        url: `https://jasantanders.dev/es/blog/${blog.slug}`,
        description: blog.description,
        categories: blog.tags,
        author: "Jesus Santander",
        date: blog.publishedAt,
      });
    });

  fs.writeFileSync(OUTPUT_FILE_EN, feedEN.xml({ indent: true }));
  console.log(`RSS feed written at ${OUTPUT_FILE_EN}`);

  fs.writeFileSync(OUTPUT_FILE_ES, feedES.xml({ indent: true }));
  console.log(`RSS feed written at ${OUTPUT_FILE_ES}`);
})();

/**
 *  if (blog.locale === "en") {

      } else {
        feedES.item({
          title: blog.title,
          url: `https://jasantanders.dev/es/blog/${blog.slug}`,
          description: blog.description,
          categories: blog.tags,
          author: "Jesus Santander",
          date: blog.publishedAt,
        });
      }
 */
