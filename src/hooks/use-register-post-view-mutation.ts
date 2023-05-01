/* eslint-disable require-jsdoc */
import { useEffect } from "react";

/**
 * Fetches featured repos data from the GitHub API.
 * @returns {void}
 **/
export const useRegisterPostViewMutation = ({
  userId,
  slug,
  trackView,
}: {
  userId: string;
  slug: string;
  trackView: boolean;
}) => {
  useEffect(() => {
    const registerView = async () => {
      const response = await fetch("/api/post-views", {
        method: "POST",
        body: JSON.stringify({ userId, slug }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
    };

    if (trackView) {
      registerView();
    }
  }, [userId, slug, trackView]);
};
