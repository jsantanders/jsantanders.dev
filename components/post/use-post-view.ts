"use client";

import { useMountEffect } from "@/hooks/use-mount-effect";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect } from "react";
import { AnalyticsContext } from "../analytics-context";
import { viewBlogPost } from "./fetch-post-statistics";

export const usePostView = (slug: string) => {
	const queryClient = useQueryClient();
	const { userId } = useContext(AnalyticsContext);

	const { mutate: markAsViewed } = useMutation({
		mutationFn: () => viewBlogPost(slug, userId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["posts-statistics", slug] });
		},
	});

	useMountEffect(() => {
		markAsViewed();
	});
};
