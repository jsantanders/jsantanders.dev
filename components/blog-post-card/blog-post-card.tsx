import { slugify } from "@/lib/utils";
import { Link } from "@/navigation";
import type { PostOverview } from "@/types";
import {
	HydrationBoundary,
	QueryClient,
	dehydrate,
} from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { getBlogPostStatistics } from "./fetch-post-statistics";
import { Views } from "./views";

export const BlogPostCard = async ({ data }: { data: PostOverview }) => {
	const queryClient = new QueryClient();
	const t = await getTranslations("blog");
	await queryClient.prefetchQuery({
		queryKey: ["post-statistics", data.slug],
		queryFn: () => getBlogPostStatistics(data.slug),
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Link href={`${data.url}`} className="w-full">
				<Card className="transition-all hover:bg-accent">
					<CardHeader className="pb-1">
						<CardDescription>
							{data.readingTime} {t("read")} • <time>{data.date}</time> •{" "}
							<Views slug={data.slug} label={t("views")} />
						</CardDescription>
						<CardTitle className="line-clamp-2 text-2xl font-bold tracking-tight lg:line-clamp-1">
							{data.title}
						</CardTitle>
					</CardHeader>
					<CardContent className="line-clamp-3 pb-2 tracking-tight text-muted-foreground lg:line-clamp-2">
						{data.summary}
					</CardContent>
					<CardFooter className="flex flex-row gap-x-2 text-secondary-foreground">
						{data.tags.map((tag) => (
							<p key={tag} className="text-sm">
								<span className="">#</span>
								{slugify(tag)}
							</p>
						))}
					</CardFooter>
				</Card>
			</Link>
		</HydrationBoundary>
	);
};
