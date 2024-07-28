"use client";

import { useQuery } from "@tanstack/react-query";
import { getBlogPostStatistics } from "./fetch-post-statistics";

export const PostViews = ({ slug, label }: { slug: string; label: string }) => {
	const { data } = useQuery({
		queryKey: ["posts-statistics", slug],
		queryFn: () => getBlogPostStatistics(slug),
	});

	return (
		<span>
			{`${data?.views ? new Number(data.views).toLocaleString() : "–––"}`}{" "}
			{label}
		</span>
	);
};
