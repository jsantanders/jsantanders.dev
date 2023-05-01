import useSWR from "swr";

import { fetcher } from "@/lib/fetcher";

type UseGraph = {
  data?: GraphData;
  isLoading: boolean;
  isError: Error;
};

/**
 * Fetches the graph data from the GitHub API.
 * @returns {UseGraph} The graph data.
 */
export const useGraph = (): UseGraph => {
  const { data, error } = useSWR<GraphData>("/api/github/graph", fetcher);

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
};
