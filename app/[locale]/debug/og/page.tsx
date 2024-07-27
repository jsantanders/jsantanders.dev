import type { Locales } from "@/config";
import { allPosts } from "content-collections";
import { compareDesc } from "date-fns";
import Image from "next/image";
import Link from "next/link";

type Props = {
	params: {
		locale: Locales;
	};
};

const OgDebugPage = ({ params: { locale } }: Props) => (
	<>
		<h1 className="text-4xl font-bold">Debug Social Media Cards</h1>
		<p className="mt-2">This page shows all social media cards at once</p>
		<ul className="mt-10 grid grid-cols-1 gap-2 md:grid-cols-2">
			{allPosts
				.filter((p) => p.locale === locale)
				.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))
				.map((post) => (
					<li key={post.url}>
						<Link href={post.url} className="group">
							<img
								className="rounded-xl border-4 border-transparent group-hover:scale-105 transition-all group-hover:border-primary-400"
								width={1200}
								height={630}
								alt={post.title}
								src={`${locale === "en" ? "" : `/${locale}`}/posts/${post.slug}/opengraph-image`}
							/>
						</Link>
					</li>
				))}
		</ul>
	</>
);

export default OgDebugPage;
