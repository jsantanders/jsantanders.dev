"use client";

import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AnalyticsContext } from "../analytics-context";
import { getBlogPostStatistics } from "./fetch-post-statistics";

export const PostViews = ({ slug, label }: { slug: string; label: string }) => {
	const { userId } = useContext(AnalyticsContext);
	const { data } = useQuery({
		queryKey: ["posts-statistics", slug],
		queryFn: () => getBlogPostStatistics(slug, userId),
	});

	return (
		<span>
			{`${data?.views ? new Number(data.views).toLocaleString() : "–––"}`}{" "}
			{label}
		</span>
	);
};
