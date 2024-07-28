import { PostCard } from "@/components/post/post-card";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
} from "@/components/ui/pagination";
import { type Locales, locales } from "@/config";
import { allTags, tagPages } from "@/lib/posts";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

type Props = { params: { locale: Locales; page: string; tag: string } };

export default async function Blog({ params }: Props) {
	unstable_setRequestLocale(params.locale);
	const t = await getTranslations("blog");
	const pageNumber = Number(params.page) - 1;
	const pages = tagPages(params.locale, params.tag);
	const page = pages[pageNumber];
	if (!page) {
		notFound();
	}

	const searchLocales = {
		title: t("search.title"),
		placeholder: t("search.placeholder"),
	};

	return (
		<div className="mx-auto flex flex-col items-start justify-center gap-y-4">
			<div>
				<h1 className="text-3xl items-center md:text-5xl font-bold tracking-tight">
					{t("tags.tagPage", { tag: params.tag })}
				</h1>
				<h2 className="text-lg tracking-tight text-muted-foreground">
					{t("page")} {params.page} {t("of")} {pages.length}
				</h2>
			</div>
			<div className="flex w-full flex-row flex-wrap gap-y-4">
				{page.map((post) => {
					return <PostCard key={post.url} data={post} />;
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
	return locales.flatMap((locale) =>
		Object.keys(allTags).map((tag) =>
			tagPages(locale, tag).map((_, page) => ({
				page: String(page + 1),
				locale: locale,
				tag: tag,
			})),
		),
	);
}
