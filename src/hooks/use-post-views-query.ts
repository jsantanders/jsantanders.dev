import useSWR from "swr";

import { fetcher } from "@/lib/fetcher";

type PostViews = {
  postViews: number;
  userViewed: number;
};

type UsePostRating = {
  data?: PostViews;
  isLoading: boolean;
  isError: Error;
};

/**
 * Fetches featured repos data from the GitHub API.
 * @returns {UsePostRating} The featured repos data.
 */
export const usePostViewsQuery = ({
  userId,
  slug,
}: {
  userId: string;
  slug: string;
}): UsePostRating => {
  const { data, error } = useSWR<PostViews>(
    `/api/post-views/?userId=${userId}&slug=${slug}`,
    fetcher
  );

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
};
