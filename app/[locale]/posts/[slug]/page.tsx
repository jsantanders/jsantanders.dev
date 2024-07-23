import { getBlogPostStatistics } from "@/components/blog-post-card/fetch-post-statistics";
import { BlogPostingSchema } from "@/components/json-l-d";
import { Markdown } from "@/components/markdown";
import { PostMetadata } from "@/components/post-metadata";
import { PostRating } from "@/components/post-rating";
import { PostTableOfContents } from "@/components/post-table-of-content";
import { locales } from "@/config";
import {
	HydrationBoundary,
	QueryClient,
	dehydrate,
} from "@tanstack/react-query";
import { allPosts } from "content-collections";
import { getMDXExport } from "mdx-bundler/client";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

type Props = {
	params: {
		slug: string;
		locale: string;
	};
};

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
	const markdownLocales = {
		codeLocales: {
			copy: t("copy"),
			copied: t("copy-success"),
			error: t("copy-error"),
		},
	};

	//TODO: refactor query-client
	const queryClient = new QueryClient();
	await queryClient.prefetchQuery({
		queryKey: ["post-statistics", slug],
		queryFn: () => getBlogPostStatistics(slug),
	});

	const post = allPosts.find((p) => p.slug === slug && p.locale === locale);
	if (!post) {
		notFound();
	}

	const toc = getMDXExport(post.content.mdx).tableOfContents;

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<div className="flex w-full">
				<article className="w-full">
					<h1 className="mb-6 text-5xl font-bold">{post.title}</h1>
					<PostMetadata
						locales={metadataLocales}
						tags={post.tags}
						slug={slug}
						publishedAt={post.date}
						readingTime={post.readingTime}
					/>
					<Markdown code={post.content.mdx} markdownLocales={markdownLocales} />
					<PostRating
						className="mt-12"
						slug={slug}
						locales={postRatingLocales}
					/>
				</article>
				<aside className="fixed hidden min-[1420px]:left-3/4 min-[1420px]:block min-[2000px]:left-[68%]">
					<PostTableOfContents toc={toc} locales={tableOfContentsLocale} />
				</aside>
				<BlogPostingSchema post={post} />
			</div>
		</HydrationBoundary>
	);
}

export const generateMetadata = ({ params }: Props) => {
	const post = allPosts.find(
		(p) => p.slug === params.slug && p.locale === params.locale,
	);
	if (!post) {
		return;
	}

	return {
		title: post.title,
		description: post.summary,
	};
};

export function generateStaticParams() {
	return locales.flatMap((locale) =>
		allPosts
			.filter((p) => p.locale === locale)
			.map((p) => ({ locale, slug: p.slug })),
	);
}

export const dynamicParams = false;
