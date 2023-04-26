import useSWR from "swr";

import { fetcher } from "@/utils/fetcher";

type UseRepos = {
  data?: ReposData;
  isLoading: boolean;
  isError: Error;
};

/**
 * Fetches featured repos data from the GitHub API.
 * @returns {UseRepos} The featured repos data.
 */
export const useRepos = (): UseRepos => {
  const { data, error } = useSWR<ReposData>("/api/github/repos", fetcher);

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
};
