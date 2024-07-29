import { redirect } from "@/navigation";
import { unstable_setRequestLocale } from "next-intl/server";

type Props = {
	params: {
		locale: string;
		tag: string;
	};
};

export default function TagPage({ params: { locale, tag } }: Props) {
	unstable_setRequestLocale(locale);
	redirect(`/tags/${tag}/pages/1`);
}
