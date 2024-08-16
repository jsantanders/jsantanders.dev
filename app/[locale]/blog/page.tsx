import { redirect } from "@/navigation";
import { unstable_setRequestLocale } from "next-intl/server";

type Props = {
	params: {
		locale: string;
	};
};

export default function BlogPage({ params: { locale } }: Props) {
	unstable_setRequestLocale(locale);
	redirect("/posts/pages/1");
}
