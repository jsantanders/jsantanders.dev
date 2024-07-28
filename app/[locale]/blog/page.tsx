import { redirect } from "@/navigation";

type Props = {
	params: {
		locale: string;
	};
};

export default function BlogPage({ params: { locale } }: Props) {
	redirect("/posts/pages/1");
}
