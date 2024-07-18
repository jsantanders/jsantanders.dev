"use client";

import { IReadTimeResults } from "reading-time";
import { Views } from "./blog-post-card/views";
import { slugify } from "@/lib/utils";

type PostMetadata = {
  tags: string[];
  publishedAt: string;
  readingTime: IReadTimeResults;
  slug: string;
  locales: {
    published: string;
    views: string;
    read: string;
  };
};

export const PostMetadata: React.FC<PostMetadata> = ({
  tags,
  publishedAt,
  readingTime,
  slug,
  locales,
}) => {
  return (
    <div className="flex flex-col justify-between text-muted-foreground md:flex-row md:items-center">
      <div className="flex flex-row gap-x-2">
        {tags.map((tag) => (
          <p key={tag} className="text-sm">
            <span className="">#</span>
            {slugify(tag)}
          </p>
        ))}
      </div>
      <div className="flex flex-row gap-x-1 text-sm">
        {readingTime.minutes.toFixed(0)} {locales.read} • <time>{publishedAt} </time> •{" "}
        <Views slug={slug} label={locales.views} />
      </div>
    </div>
  );
};
