import { redirect } from "@/navigation";

type Props = {
	params: {
		locale: string;
	};
};

export default function PostPage({ params: { locale } }: Props) {
	redirect("/posts/pages/1");
}
