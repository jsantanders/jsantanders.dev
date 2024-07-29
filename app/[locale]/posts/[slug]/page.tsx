import { Markdown } from "@/components/markdown";
import { BlogPostingSchema } from "@/components/post/json-l-d";
import { PostMetadata } from "@/components/post/post-metadata";
import { PostRating } from "@/components/post/post-rating";
import { PostTableOfContents } from "@/components/post/post-table-of-content";
import { PostTags } from "@/components/post/post-tags";
import { locales } from "@/config";
import { allPosts } from "content-collections";
import { getMDXExport } from "mdx-bundler/client";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import "@/app/styles/katex.css";
import "@/app/styles/mafs.css";
import "@/app/styles/prism.css";

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

	const post = allPosts.find((p) => p.slug === slug && p.locale === locale);
	if (!post) {
		notFound();
	}

	const toc = getMDXExport(post.content.mdx).tableOfContents;

	return (
		<div className="flex w-full">
			<article className="w-full">
				<PostMetadata
					slug={slug}
					publishedAt={post.date}
					readingTime={post.readingTime}
				/>
				<h1 className="my-2 text-5xl font-bold">{post.title}</h1>
				<PostTags tags={post.tags} as="link" />
				<Markdown code={post.content.mdx} markdownLocales={markdownLocales} />
				<PostRating className="mt-12" slug={slug} locales={postRatingLocales} />
			</article>
			<aside className="fixed hidden min-[1420px]:left-3/4 min-[1420px]:block min-[2000px]:left-[68%]">
				<PostTableOfContents toc={toc} locales={tableOfContentsLocale} />
			</aside>
			<BlogPostingSchema post={post} />
		</div>
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
