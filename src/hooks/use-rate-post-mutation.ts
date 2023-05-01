/* eslint-disable require-jsdoc */

import { useState } from "react";

type UseRatePost = {
  isLoading: boolean;
  isError: boolean;
  mutate: (rating: number) => void;
};

/**
 * Fetches featured repos data from the GitHub API.
 * @returns {UsePostRating} The featured repos data.
 */
export const useRatePostMutation = ({
  userId,
  slug,
  onSuccess,
}: {
  userId: string;
  slug: string;
  onSuccess?: (data: { userRating: number }) => void;
}): UseRatePost => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const mutate = async (rating: number) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/post-ratings", {
        method: "POST",
        body: JSON.stringify({ userId, slug, rating }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      onSuccess && onSuccess(await response.json());
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    isError,
    mutate: mutate,
  };
};
