import { CodeFrecuency } from "@/components/code-frecuency";
import { CodeFrencuencyCalendar } from "@/components/code-frecuency-calendar";
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

  const codeFrecuencyLocales = {
    days: {
      mon: t("mon"),
      wed: t("wed"),
      fri: t("fri"),
    },
    moreLess: {
      more: t("more"),
      less: t("less"),
    },
  };

  return (
    <div className="mx-auto flex max-w-full flex-col items-start justify-center gap-y-4">
      <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
        {t("title")}
      </h1>
      <p>
        {t("1")} {<Link href="https://cv.jsantanders.dev">CV</Link>}
      </p>
      <p>{t("2")}</p>
      <CodeFrencuencyCalendar />
    </div>
  );
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
