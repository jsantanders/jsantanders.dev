import { CodeFrencuencyCalendar } from "@/components/code-frecuency-calendar";
import { Repos } from "@/components/pinned-repos";
import { type Locales, locales } from "@/config";
import { Link } from "@/navigation";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

type Props = {
	params: {
		locale: Locales;
	};
};

export default async function About({ params: { locale } }: Props) {
	unstable_setRequestLocale(locale);
	const t = await getTranslations("about");

	const codeFrequencyLocales = {
		months: [
			t("months.jan"),
			t("months.feb"),
			t("months.mar"),
			t("months.apr"),
			t("months.may"),
			t("months.jun"),
			t("months.jul"),
			t("months.aug"),
			t("months.sep"),
			t("months.oct"),
			t("months.nov"),
			t("months.dec"),
		],
		weekdays: [
			t("weekdays.sun"),
			t("weekdays.mon"),
			t("weekdays.tue"),
			t("weekdays.wed"),
			t("weekdays.thu"),
			t("weekdays.fri"),
			t("weekdays.sat"),
		],
		totalCount: t("totalCount"),
		legend: {
			less: t("legend.less"),
			more: t("legend.more"),
		},
	};

	return (
		<div className="mx-auto flex max-w-full flex-col items-start justify-center gap-y-8">
			<h1 className="text-3xl md:text-5xl font-bold tracking-tight">
				{t("title")}
			</h1>
			<div className="space-y-3 text-md leading-6">
				<p>
					{t.rich("description_1", {
						rust: (chunks) => (
							<Link className="underline" href="https://www.rust-lang.org/">
								{chunks}
							</Link>
						),
						go: (chunks) => (
							<Link className="underline" href="https://go.dev/">
								{chunks}
							</Link>
						),
					})}
				</p>
				<p>{t("description_2")}</p>
				<p>
					{t.rich("description_3", {
						resume: (chunks) => (
							<Link
								className="underline font-semibold"
								href="https://cv.jsantanders.dev"
								target="_blank"
								rel="noopener noreferrer"
							>
								{chunks}
							</Link>
						),
					})}
				</p>
			</div>
			<div className="max-w-full space-y-2">
				<h2 className="text-xl md:text-2xl font-bold tracking-tight">
					{t("codeFrec")}
				</h2>
				<CodeFrencuencyCalendar labels={codeFrequencyLocales} />
			</div>
			<div className="min-w-full space-y-2">
				<h2 className="text-xl md:text-2xl font-bold tracking-tight">
					{t("featuredRepos")}
				</h2>
				<Repos />
			</div>
		</div>
	);
}

export function generateStaticParams() {
	return locales.map((locale) => ({ locale }));
}

export const generateMetadata = async ({ params }: Props) => {
	const t = await getTranslations("about");

	return {
		title: t("seo.title"),
		description: t("seo.description"),
	};
};
