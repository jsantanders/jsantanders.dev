import { Link } from "@/navigation";
import type { PostOverview } from "@/types";
import { AutoTooltip } from "../auto-tooltip";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { PostMetadata } from "./post-metadata";
import { PostTags } from "./post-tags";

export const PostCard = async ({ data }: { data: PostOverview }) => {
	return (
		<Link href={`${data.url}`} className="w-full">
			<Card className="transition-all hover:bg-accent">
				<CardHeader className="pb-1">
					<PostMetadata
						slug={data.slug}
						readingTime={data.readingTime}
						publishedAt={data.date}
					/>

					<CardTitle className="line-clamp-2 text-2xl font-bold tracking-tight lg:line-clamp-1">
						<AutoTooltip>{data.title}</AutoTooltip>
					</CardTitle>
				</CardHeader>
				<CardContent className="line-clamp-3 pb-2 tracking-tight text-muted-foreground lg:line-clamp-2">
					<AutoTooltip>{data.summary}</AutoTooltip>
				</CardContent>
				<CardFooter className="flex flex-row gap-x-2 text-secondary-foreground">
					<PostTags tags={data.tags} />
				</CardFooter>
			</Card>
		</Link>
	);
};
