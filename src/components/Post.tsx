import { useContext, useMemo } from "react";

import { Toc } from "@stefanprobst/rehype-extract-toc";
import clsx from "clsx";
import { getMDXComponent } from "mdx-bundler/client";
import { Tweet } from "react-tweet";
import type { IReadTimeResults } from "reading-time";

import { usePostViewsQuery } from "@/hooks/use-post-views-query";
import { useRegisterPostViewMutation } from "@/hooks/use-register-post-view-mutation";
import { Callout } from "@/ui/Callout";
import { Code } from "@/ui/Code";
import { ConsCard } from "@/ui/ConsCard";
import { Division } from "@/ui/Division";
import { Heading } from "@/ui/Heading";
import { Image } from "@/ui/Image";
import { List } from "@/ui/List";
import { ListItem } from "@/ui/ListItem";
import { Paragraph } from "@/ui/Paragraph";
import { Preformatted } from "@/ui/Preformatted";
import { ProsCard } from "@/ui/ProsCard";
import { TextLink } from "@/ui/TextLink";
import { TweetCmp } from "@/ui/TweetComponents";

import { AnalyticsContext } from "./AnalyticsContext";
import { PostMeta } from "./PostMeta";
import { PostRating } from "./PostRating";
import { TableOfContents } from "./PostTableOfContent";

export type Information = {
  slug: string;
  readingTime: IReadTimeResults;
} & Frontmatter;

export type Frontmatter = {
  title: string;
  description: string;
  isPublished: boolean;
  publishedAt: string;
  tags: string[];
};

export type PostProps = {
  code: string;
  frontmatter: Frontmatter;
  readingTime: IReadTimeResults;
  tableOfContents: Toc;
  slug: string;
};

const MDXComponents = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => <Heading level="h1" {...props} />,
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => <Heading level="h2" {...props} />,
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => <Heading level="h3" {...props} />,
  h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => <Heading level="h4" {...props} />,
  h5: (props: React.HTMLAttributes<HTMLHeadingElement>) => <Heading level="h5" {...props} />,
  h6: (props: React.HTMLAttributes<HTMLHeadingElement>) => <Heading level="h6" {...props} />,
  p: Paragraph,
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => <List type="ul" {...props} />,
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => <List type="ol" {...props} />,
  li: ListItem,
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <Image {...props} />,
  a: TextLink as React.FC, // fixed type on mdx-bundler
  code: Code as unknown as React.FC, // fixed type on mdx-bundler
  pre: Preformatted as React.FC, // fixed type on mdx-bundler
  div: Division as React.FC, // fixed type on mdx-bundler
  Tweet: (props: React.ComponentProps<typeof Tweet>) => <Tweet {...props} components={TweetCmp} />,
  Callout,
  ProsCard,
  ConsCard,
};

/**
 * Renders a blog post
 * @param {Blog} props The component props
 * @returns {React.ReactElement} The component
 */
export const Post: React.FC<PostProps> = ({
  code,
  frontmatter,
  readingTime,
  slug,
  tableOfContents,
}) => {
  const Component = useMemo(() => getMDXComponent(code), [code]);

  const { userId } = useContext(AnalyticsContext);

  const { data } = usePostViewsQuery({ slug, userId });
  useRegisterPostViewMutation({
    slug,
    userId,
    trackView: data?.userViewed !== undefined && !data?.userViewed,
  });

  const styles = tableOfContents.length > 0 ? "md:max-w-[70%]" : "md:max-w-3xl";

  return (
    <div className="flex flex-row">
      <article className={clsx("w-full md:mr-16 ", styles)}>
        <h1 className="mb-6 text-5xl font-bold">{frontmatter.title}</h1>
        <PostMeta
          tags={frontmatter.tags}
          publishedAt={frontmatter.publishedAt}
          readingTime={readingTime}
          views={data?.postViews}
        />
        <Component components={MDXComponents} />
        <PostRating slug={slug} />
      </article>
      {tableOfContents.length > 0 && (
        <aside className="sticky top-8 mt-32 hidden h-1/4 max-w-[30%] space-y-10 pt-1.5 md:block">
          <TableOfContents toc={tableOfContents} />
        </aside>
      )}
    </div>
  );
};
