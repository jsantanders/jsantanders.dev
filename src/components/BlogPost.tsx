import { useMemo } from "react";

import { useRouter } from "next/router";

import { getMDXComponent } from "mdx-bundler/client";
import type { IReadTimeResults } from "reading-time";

import { Container } from "@/components/Container";
import { Box } from "@/ui/Box";
import { Code } from "@/ui/Code";
import { Division } from "@/ui/Division";
import { Heading } from "@/ui/Heading";
import { Image } from "@/ui/Image";
import { List } from "@/ui/List";
import { ListItem } from "@/ui/ListItem";
import { Paragraph } from "@/ui/Paragraph";
import { Preformatted } from "@/ui/Preformatted";
import { TextLink } from "@/ui/TextLink";

import { BlogRow } from "./BlogRow";

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

export type Blog = {
  code: string;
  frontmatter: Frontmatter;
  readingTime: IReadTimeResults;
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
  Box,
};

/**
 * Renders a blog post
 * @param {Blog} props The component props
 * @returns {React.ReactElement} The component
 */
export const BlogPost: React.FC<Blog> = ({ code, frontmatter, readingTime }) => {
  const Component = useMemo(() => getMDXComponent(code), [code]);
  const router = useRouter();

  const seo = {
    type: "article",
    image: `https://jsantanders.dev/api${router.asPath}`,
    imageAlt: frontmatter.title,
    ...frontmatter,
  };

  return (
    <Container seo={seo as unknown as { [key: string]: string }}>
      <article className="w-full max-w-3xl">
        <h1 className="mb-6 text-5xl font-bold">{frontmatter.title}</h1>
        <BlogRow
          tags={frontmatter.tags}
          publishedAt={frontmatter.publishedAt}
          readingTime={readingTime}
        />
        <Component components={MDXComponents} />
      </article>
    </Container>
  );
};
