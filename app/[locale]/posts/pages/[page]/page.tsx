import { BlogPostCard } from "@/components/blog-post-card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { type Locales, locales } from "@/config";
import { pages as pagesByLocale } from "@/lib/posts";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

type Props = { params: { locale: Locales; page: string } };

export default async function Blog({ params }: Props) {
  unstable_setRequestLocale(params.locale);
  const t = await getTranslations("blog");
  const pageNumber = Number(params.page) - 1;
  const pages = pagesByLocale(params.locale);
  const page = pages[pageNumber];
  if (!page) {
    notFound();
  }

  return (
    <div className="mx-auto flex flex-col items-start justify-center gap-y-4">
      <div>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
          {t("title")}
        </h1>
        <h2 className="text-lg tracking-tight text-muted-foreground">
          Page {params.page} of {pages.length}
        </h2>
      </div>
      <div className="flex w-full flex-row flex-wrap gap-y-4">
        {page.map((post) => {
          return <BlogPostCard key={post.url} data={post} />;
        })}
      </div>
      <div className="flex justify-center mx-auto">
        <Pagination>
          <PaginationContent>
            {pages.map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={i === pageNumber}
                  href={`/posts/pages/${i + 1}`}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return locales.map((locale) =>
    pagesByLocale(locale).map((_, page) => ({
      page: String(page + 1),
      locale: locale,
    })),
  );
}
