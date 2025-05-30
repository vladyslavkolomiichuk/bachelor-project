"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const calculateAverageRating = (ratingCounts) => {
  let totalVotes = 0;
  let totalScore = 0;

  for (const rating in ratingCounts) {
    const count = ratingCounts[rating];
    const ratingNum = parseInt(rating);

    totalVotes += count;
    totalScore += ratingNum * count;
  }

  const averageRating = totalVotes === 0 ? 0 : totalScore / totalVotes;

  return {
    averageRating: parseFloat(averageRating.toFixed(2)),
    totalVotes,
  };
};

function calculateRatingPercentages(ratingCounts) {
  const result = {};
  let totalVotes = 0;

  for (const rating in ratingCounts) {
    totalVotes += ratingCounts[rating];
  }

  for (const rating in ratingCounts) {
    const votes = ratingCounts[rating];
    const percentage =
      totalVotes === 0 ? 0 : Math.round((votes / totalVotes) * 100);
    result[rating] = percentage;
  }

  return result;
}

const ReviewsContext = createContext();

export function ReviewsProvider({ children }) {
  const [reviews, setReviews] = useState([]);
  const [ratingCounts, setRatingCounts] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const replaceAllReviews = useCallback((newReviewArray) => {
    setReviews(newReviewArray);
  }, []);

  const addRatingCounts = useCallback((newRatingCountsArray) => {
    const { averageRating, totalVotes } =
      calculateAverageRating(newRatingCountsArray);
    const percentages = calculateRatingPercentages(newRatingCountsArray);
    setRatingCounts({ averageRating, totalVotes, percentages });
  }, []);

  // const addReview = useCallback((newReview) => {
  //   setReviews((prevReviews) => [newReview, ...prevReviews]);
  // }, []);

  const deleteReview = useCallback((reviewId) => {
    setReviews((prevReviews) =>
      prevReviews.filter((review) => review.id !== reviewId)
    );
  }, []);

  const contextValue = useMemo(
    () => ({
      reviews,
      ratingCounts,
      replaceAllReviews,
      addRatingCounts,
      refreshTrigger,
      triggerRefresh,
      // addReview,
      deleteReview,
    }),
    [reviews, replaceAllReviews, refreshTrigger, triggerRefresh]
  );

  return (
    <ReviewsContext.Provider value={contextValue}>
      {children}
    </ReviewsContext.Provider>
  );
}

export function useReviews() {
  return useContext(ReviewsContext);
}
