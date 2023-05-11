import { useContext, useEffect, useState } from "react";

import { useI18n } from "next-localization";

import { PostRating as PostRatingType, usePostRatingsQuery } from "@/hooks/use-post-ratings-query";
import { useRatePostMutation } from "@/hooks/use-rate-post-mutation";
import Spinner from "@/icons/spinner.svg";

import { AnalyticsContext } from "./AnalyticsContext";
import { Rating } from "./Rating";

type RatingProps = {
  slug: string;
};

/**
 * User rating component
 * @param {RatingProps} props The component props
 * @returns {React.ReactElement} The component
 */
export const PostRating: React.FC<RatingProps> = ({ slug }) => {
  const { userId } = useContext(AnalyticsContext);
  const i18n = useI18n();

  const { isFetching, data, mutate: mutateQuery } = usePostRatingsQuery({ slug, userId });
  const [rating, setRating] = useState<number>(0);
  const { isLoading, mutate } = useRatePostMutation({
    slug,
    userId,
    onSuccess: (data) => mutateQuery(recalculateAvgRating(data.userRating)),
  });

  useEffect(() => {
    if (data) {
      setRating(data.userRating);
    }
  }, [data]);

  // eslint-disable-next-line require-jsdoc
  const recalculateAvgRating = (rate: number): PostRatingType | undefined => {
    if (data) {
      const { averagePostRating, totalRatings } = data;
      const newAverageRating = (averagePostRating * totalRatings + rate) / (totalRatings + 1);
      return {
        ...data,
        averagePostRating: newAverageRating,
        totalRatings: totalRatings + 1,
        userRating: rate,
      };
    }
    return undefined;
  };

  const { averagePostRating, totalRatings } = data || {};
  const hasUserRated = !!data?.userRating;

  return isFetching ? (
    <></>
  ) : (
    <span className="flex flex-col items-center justify-center">
      <h1 className="text-color-primary pb-3 pt-12 text-center text-2xl font-bold">
        {hasUserRated ? i18n.t("blog.rating.thanks") : i18n.t("blog.rating.title")}
      </h1>
      <Rating
        readonly={hasUserRated}
        value={rating}
        fractions={2}
        onClick={(rate) => setRating(rate)}
      />
      {!hasUserRated && rating > 0 && (
        <div className="py-2">
          <button
            type="button"
            disabled={isLoading}
            onClick={() => mutate(rating)}
            className="rounded-lg border border-primary px-4 py-1.5 text-center text-lg font-semibold hover:bg-secondary hover:text-primary focus:outline-none focus-visible:bg-secondary focus-visible:text-primary focus-visible:ring-2 active:bg-tertiary dark:border-primary md:mr-4"
          >
            {isLoading ? (
              <Spinner className="inline h-8 w-8 animate-spin fill-gray-600 text-center text-gray-200 dark:fill-gray-300 dark:text-gray-600" />
            ) : (
              i18n.t("blog.rating.submit")
            )}
          </button>
        </div>
      )}
      {hasUserRated && totalRatings && averagePostRating && (
        <div className="py-2">
          <span className="text-color-primary text-2xl font-bold">
            {averagePostRating.toFixed(1)}
          </span>
          <span className="text-color-primary text-md font-bold"> / 5.0</span>
          <span className="text-color-primary text-md font-bold">
            {" "}
            ({totalRatings} {i18n.t("blog.rating.votes")})
          </span>
        </div>
      )}
    </span>
  );
};
