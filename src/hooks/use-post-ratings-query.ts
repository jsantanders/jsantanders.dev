import useSWR, { KeyedMutator } from "swr";

import { fetcher } from "@/lib/fetcher";

export type PostRating = {
  averagePostRating: number;
  userRating: number;
  totalRatings: number;
};

type UsePostRating = {
  data?: PostRating;
  isFetching: boolean;
  isError: Error;
  mutate: KeyedMutator<PostRating>;
};

/**
 * Fetches featured repos data from the GitHub API.
 * @returns {UsePostRating} The featured repos data.
 */
export const usePostRatingsQuery = ({
  userId,
  slug,
}: {
  userId: string;
  slug: string;
}): UsePostRating => {
  const { data, error, mutate } = useSWR<PostRating>(
    `/api/post-ratings?userId=${userId}&slug=${slug}`,
    fetcher
  );

  return {
    data,
    isFetching: !error && !data,
    isError: error,
    mutate,
  };
};
