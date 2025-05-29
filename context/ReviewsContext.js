"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const ReviewsContext = createContext();

export function ReviewsProvider({ children }) {
  const [reviews, setReviews] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const replaceAllReviews = useCallback((newReviewArray) => {
    setReviews(newReviewArray);
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
      replaceAllReviews,
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
