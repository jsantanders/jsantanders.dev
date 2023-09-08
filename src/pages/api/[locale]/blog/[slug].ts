import type { NextApiRequest, NextApiResponse } from "next";

import { generateBlogImageHTML } from "@/lib/blog-image";
import screenshot from "@/lib/screenshot";

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<NextApiResponse | void> => {
  const { slug, locale = "en" } = req.query || {};

  if (slug && typeof slug === "string") {
    const slugWithoutLocale = slug.replace(`/${locale}`, "");
    const response = await fetch(
      `https://api.github.com/repos/jsantanders/jsantanders.dev/contents/blogs/${slugWithoutLocale}/index${
        locale === "en" ? "" : ".es"
      }.mdx`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github.raw",
        },
      }
    );

    if (!response.ok) {
      return res.status(response.status).send(response.statusText);
    }

    const blog = await response.text();
    const html = generateBlogImageHTML(blog, locale as string);
    const file = await screenshot(html);
    res.setHeader("Content-Type", "image/png");
    res.setHeader(
      "Cache-Control",
      "public, immutable, no-transform, s-maxage=31536000, max-age=31536000"
    );
    return res.status(200).end(file);
  }

  return res.status(404).send("Not Found");
};
