import { SocialLink } from "@/components/social-link";
import {
  ArrowRightIcon,
  GitHubLogoIcon,
  LinkedInLogoIcon,
  TwitterLogoIcon,
} from "@radix-ui/react-icons";
import { Link } from "@/navigation";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { locales } from "@/config";
import { getPostsInformation } from "@/lib/mdx";
import { Information } from "@/types/information";
import { BlogPostCard } from "@/components/blog-post-card";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function Home({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations("home");
  const posts = await getPostsInformation(locale, 3);

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-start justify-center">
      <div className="flex flex-col-reverse items-start sm:flex-row">
        <div className="mb-10 flex flex-col">
          <h1 className="mb-2 text-3xl font-bold tracking-tight md:text-5xl">{t("welcome")}</h1>
          <h2 className="mb-4">
            {t("title")}{" "}
            <span className="font-semibold">
              <a href="https://arroyoconsulting.net" target="_blank" rel="noopener noreferrer">
                Arroyo
              </a>
            </span>
          </h2>
          <p className="mb-8 text-muted-foreground">{t("about")}</p>
          <div className="my-6 flex items-center justify-center gap-10 align-middle">
            <SocialLink href={"https://twitter.com/jsantanders"} ariaLabel={t("social.twitter")}>
              <TwitterLogoIcon width={24} height={24} />
            </SocialLink>
            <SocialLink href={"https://github.com/jsantanders"} ariaLabel={t("social.github")}>
              <GitHubLogoIcon width={24} height={24} />
            </SocialLink>
            <SocialLink
              href={"https://linkedin.com/in/jsantanders"}
              ariaLabel={t("social.linkedin")}
            >
              <LinkedInLogoIcon width={24} height={24} />
            </SocialLink>
          </div>
        </div>
      </div>
      <div className="mb-6 flex w-full flex-row items-center justify-between">
        <h3 className="align-middle text-2xl font-bold tracking-tight md:text-4xl">
          {t("recentPosts")}
        </h3>
        <Link
          className="flex items-center gap-x-2 text-muted-foreground transition-all hover:text-primary"
          href="/posts"
        >
          {t("readMore")}
          <ArrowRightIcon />
        </Link>
      </div>
      <div className="flex w-full flex-row flex-wrap gap-y-4">
        {posts.map((post: Information) => {
          return <BlogPostCard key={post.slug} data={post} />;
        })}
      </div>
    </div>
  );
}
