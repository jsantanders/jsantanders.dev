import { PostCard } from "@/components/post/post-card";
import { Search } from "@/components/search";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
} from "@/components/ui/pagination";
import { type Locales, locales } from "@/config";
import { pages, pages as pagesByLocale } from "@/lib/posts";
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

	const searchLocales = {
		title: t("search.title"),
		placeholder: t("search.placeholder"),
		notFound: t("none"),
	};

	return (
		<div className="mx-auto flex flex-col items-start justify-center gap-y-4">
			<div className="flex flex-col justify-start">
				<div className="flex flex-row place-items-center space-x-4">
					<h1 className="text-3xl text-left md:text-5xl font-bold tracking-tight">
						{t("title")}
					</h1>
					<Search locales={searchLocales} locale={params.locale} />
				</div>
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
		pagesByLocale(locale).map((_, page) => ({
			page: String(page + 1),
			locale: locale,
		})),
	);
}

export const generateMetadata = async ({ params }: Props) => {
	unstable_setRequestLocale(params.locale);
	const t = await getTranslations("tags");

	return {
		title: t("page.seo.title", { page: params.page }),
		description: t("page.seo.description", {
			page: params.page,
			total: pages(params.locale).length,
		}),
	};
};

export const dynamicParams = false;
