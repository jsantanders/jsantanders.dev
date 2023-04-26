/* eslint-disable no-console */
import fs from "fs";
import globby from "globby";
import matter from "gray-matter";
import path from "path";
import { SitemapStream } from "sitemap";

const OUTPUT_FILE = path.resolve(__dirname, "..", "public", "sitemap.xml");

(async () => {
  const sitemap = new SitemapStream({
    hostname: "https://jsantanders.dev",
    xmlns: {
      xhtml: true,
      news: false,
      image: false,
      video: false,
    },
  });

  const locales = ["en", "es"];

  const pages = await globby([
    "src/pages/*.tsx",
    "!src/pages/404.tsx",
    "!src/pages/500.tsx",
    "!src/pages/_*.tsx",
    "!src/pages/api",
  ]);

  const blogSlugs = fs.readdirSync(path.join(__dirname, "..", "blogs"));

  const writeStream = fs.createWriteStream(OUTPUT_FILE);

  sitemap.pipe(writeStream);

  pages.forEach((page) => {
    const name = path.basename(page, path.extname(page));
    const url = name === "index" ? "/" : `/${name}`;
    for (const locale of locales) {
      sitemap.write({
        url: locale === "en" ? url : `/es${url}`,
        links: [
          { lang: "en", url: `https://jsantanders.dev${url}` },
          { lang: "es", url: `https://jsantanders.dev/es${url}` },
        ],
      });
    }
  });

  blogSlugs.forEach((slug) => {
    const url = `/blog/${slug}`;
    const source = fs.readFileSync(path.join(__dirname, "..", "blogs", slug, "index.mdx"), "utf8");
    const { data } = matter(source);

    if (data.isPublished) {
      sitemap.write({
        url: data.locale === "en" ? url : `/es${url}`,
        links: [
          {
            lang: "en",
            url: `https://jsantanders.dev${url}`,
          },
          {
            lang: "es",
            url: `https://jsantanders.dev/es${url}`,
          },
        ],
      });
    }
  });

  sitemap.end();

  console.log(`Sitemap written at ${OUTPUT_FILE}`);
})();
