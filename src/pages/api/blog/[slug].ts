import type { NextApiRequest, NextApiResponse } from "next";

import { generateBlogImageHTML } from "@/lib/blog-image";
import screenshot from "@/lib/screenshot";

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<NextApiResponse | void> => {
  const { slug } = req.query || {};

  if (slug) {
    const response = await fetch(
      `https://raw.githubusercontent.com/jsantanders/jsantanders.dev/main/blogs/${slug}/index.mdx`
    );

    if (!response.ok) {
      return res.status(response.status).send(response.statusText);
    }

    const blog = await response.text();
    const html = generateBlogImageHTML(blog);
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
