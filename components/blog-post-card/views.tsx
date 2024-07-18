"use client";

import { useQuery } from "@tanstack/react-query";
import { getBlogPostStatistics } from "./fetch-post-statistics";

export const Views = ({ slug, label }: { slug: string; label: string }) => {
  const { data } = useQuery({
    queryKey: ["posts-statistics", slug],
    queryFn: () => getBlogPostStatistics(slug),
  });
  const views = data?.views;

  return (
    <span>
      {`${views ? new Number(views).toLocaleString() : "–––"}`} {label}
    </span>
  );
};
