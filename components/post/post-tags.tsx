import { cn, slugify } from "@/lib/utils";
import { Link } from "@/navigation";

type Props = {
	tags: string[];
	as?: "link" | "container";
};

export const PostTags = ({ tags, as = "container" }: Props) => {
	const Component = as === "link" ? Link : "div";
	return (
		<div className="flex flex-row gap-x-2">
			{tags.map((tag) => (
				<Component
					href={as === "link" ? `/tags/${slugify(tag)}/pages/1` : ""}
					key={tag}
					className={cn(
						"text-sm flex flex-row",
						as === "link" && "hover:underline",
					)}
				>
					<span className="text-secondary-foreground">#</span>
					<span className="bg-gradient-to-r from-neutral-800 via-neutral-600 to-neutral-400 dark:from-neutral-200 dark:via-neutral-400 dark:to-neutral-600 text-transparent bg-clip-text">
						{slugify(tag)}
					</span>
				</Component>
			))}
		</div>
	);
};
