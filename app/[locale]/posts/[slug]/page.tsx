import {
  Callout,
  Code,
  ConsCard,
  Division,
  Heading,
  List,
  ListItem,
  Paragraph,
  Preformatted,
  ProsCard,
  RoundedImage,
  TextLink,
  Tweet,
} from "@/components/mdx";
import { locales } from "@/config";
import { bundleBlogPost, getPostsSlugs, getTableOfContents } from "@/lib/mdx";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { getMDXComponent } from "mdx-bundler/client";
import { getBlogPostStatistics } from "@/components/blog-post-card/fetch-post-statistics";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { PostMetadata } from "@/components/post-metadata";
import readingTime from "reading-time";
import { PostRating } from "@/components/post-rating";
import { PostTableOfContents } from "@/components/post-table-of-content";

export async function generateStaticParams() {
  return await Promise.all(
    locales.map(async (locale) => {
      const slugs = await getPostsSlugs();
      return slugs.map((slug) => ({ locale, slug }));
    }),
  );
}

export default async function Post({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations("blog");
  const metadataLocales = {
    published: t("published"),
    views: t("views"),
    read: t("read"),
  };
  const postRatingLocales = {
    thanks: t("rating.thanks"),
    title: t("rating.title"),
    votes: t("rating.votes"),
  };
  const tableOfContentsLocale = {
    title: t("toc.title"),
  };
  const codeLocales = {
    copy: t("copy"),
    copied: t("copy-success"),
    error: t("copy-error"),
  };

  const MDXComponents = {
    h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <Heading level="h1" {...props} />
    ),
    h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <Heading level="h2" {...props} />
    ),
    h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <Heading level="h3" {...props} />
    ),
    h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <Heading level="h4" {...props} />
    ),
    h5: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <Heading level="h5" {...props} />
    ),
    h6: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <Heading level="h6" {...props} />
    ),
    p: Paragraph,
    ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
      <List type="ul" {...props} />
    ),
    ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
      <List type="ol" {...props} />
    ),
    li: (props: React.HTMLAttributes<HTMLLIElement>) => <ListItem {...props} />,
    img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
      <RoundedImage {...props} />
    ),
    a: TextLink as React.FC,
    code: Code as unknown as React.FC,
    pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
      <Preformatted {...props} locales={codeLocales} />
    ),
    div: Division as React.FC,
    Tweet: (props: React.ComponentProps<typeof Tweet>) => <Tweet {...props} />,
    Callout,
    ProsCard,
    ConsCard,
  };

  //TODO: refactor query-client
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["post-statistics", slug],
    queryFn: () => getBlogPostStatistics(slug),
  });

  const { code, frontmatter, matter } = await bundleBlogPost(slug, locale);
  const Component = getMDXComponent(code);
  const rt = readingTime(matter.content);
  const tableOfContents = getTableOfContents(code);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex w-full">
        <article className="w-full">
          <h1 className="mb-6 text-5xl font-bold">{frontmatter.title}</h1>
          <PostMetadata
            locales={metadataLocales}
            tags={frontmatter.tags}
            slug={slug}
            publishedAt={frontmatter.publishedAt}
            readingTime={rt}
          />
          <Component components={MDXComponents} />
          <PostRating slug={slug} locales={postRatingLocales} />
        </article>
        {
          //TODO: Not conviced yet about adding a TOC
          //<aside className="fixed hidden min-[1420px]:left-3/4 min-[1420px]:block min-[2000px]:left-[68%]">
          //<PostTableOfContents toc={tableOfContents} locales={tableOfContentsLocale} />
          //</aside>
        }
      </div>
    </HydrationBoundary>
  );
}
