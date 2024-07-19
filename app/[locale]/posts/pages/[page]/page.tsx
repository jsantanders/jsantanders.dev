import { BlogPostCard } from "@/components/blog-post-card";
import { locales } from "@/config";
import { getPostsInformation } from "@/lib/mdx";
import { Information } from "@/types/information";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function Blog({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations("blog");
  const posts = await getPostsInformation(locale);

  return (
    <div className="mx-auto flex flex-col items-start justify-center gap-y-4">
      <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
      <div className="flex w-full flex-row flex-wrap gap-y-4">
        {posts.map((post: Information) => {
          return <BlogPostCard key={post.slug} data={post} />;
        })}
      </div>
    </div>
  );
}
