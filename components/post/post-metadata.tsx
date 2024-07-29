import { getQueryClient } from "@/query-client";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Calendar, Clock, Eye } from "lucide-react";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { getBlogPostStatistics } from "./fetch-post-statistics";
import { PostViews } from "./post-views";

type PostMetadata = {
	publishedAt: string;
	readingTime: string;
	slug: string;
};

export const PostMetadata: React.FC<PostMetadata> = async ({
	publishedAt,
	readingTime,
	slug,
}) => {
	const t = await getTranslations("blog");

	const queryClient = getQueryClient();
	await queryClient.prefetchQuery({
		queryKey: ["post-statistics", slug],
		queryFn: () => getBlogPostStatistics(slug),
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<div className="flex flex-row gap-x-2 text-muted-foreground text-xs md:text-sm">
				<div className="flex flex-row place-items-center gap-x-2">
					<Calendar size={12} />
					<time>{publishedAt}</time>
				</div>
				<div>•</div>
				<div className="flex flex-row place-items-center gap-x-2">
					<Clock size={12} />
					<span>
						{readingTime} {t("read")}
					</span>
				</div>
				<div>•</div>
				<div className="flex flex-row place-items-center gap-x-2">
					<Eye size={12} />
					<PostViews slug={slug} label={t("views")} />
				</div>
			</div>
		</HydrationBoundary>
	);
};
