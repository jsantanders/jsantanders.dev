import { Badge } from "@/components/ui/badge";
import { type Locales, locales } from "@/config";
import { allTags } from "@/lib/posts";
import { Link } from "@/navigation";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

type Props = {
	params: { locale: Locales };
};

export default async function Tags({ params: { locale } }: Props) {
	unstable_setRequestLocale(locale);
	const t = await getTranslations("blog");
	const tags = allTags(locale);

	return (
		<div className="mx-auto flex max-w-full flex-col justify-center items-start gap-y-8">
			<h1 className="text-3xl md:text-5xl font-bold tracking-tight">
				{t("tags.title")}
			</h1>
			<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
				{Object.keys(tags)?.map((tag) => (
					<Link
						key={tag}
						href={`/tags/${tag}/pages/1`}
						className="inline-flex text-center items-center justify-center rounded-md border border-muted px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
						prefetch={false}
					>
						#{tag} ({tags[tag]})
					</Link>
				))}
			</div>
		</div>
	);
}

export function generateStaticParams() {
	return locales.map((locale) => ({ locale }));
}

export const generateMetadata = async ({ params }: Props) => {
	const t = await getTranslations("tags");

	return {
		title: t("seo.title"),
		description: t("seo.description"),
	};
};
