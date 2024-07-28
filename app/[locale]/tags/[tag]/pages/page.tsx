import { redirect } from "@/navigation";

type Props = {
	params: {
		locale: string;
		tag: string;
	};
};

export default function TagPage({ params: { locale, tag } }: Props) {
	redirect(`/tags/${tag}/pages/1`);
}
