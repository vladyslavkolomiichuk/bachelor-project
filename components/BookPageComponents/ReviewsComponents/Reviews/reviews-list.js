"use client";

import { useEffect, useState } from "react";
import { getBookReviews } from "@/lib/db/review";
import Review from "./review";
import { useReviews } from "@/context/ReviewsContext";
import { useUser } from "@/context/UserContext";
import ProtectedLoading from "@/app/(protected)/loading";

import styles from "./reviews.module.css";

const SORT_OPTIONS = [
  { value: "date_desc", label: "Date: from newer" },
  { value: "date_asc", label: "Date: from older" },
  { value: "rating_desc", label: "Rating: from the highest" },
  { value: "rating_asc", label: "Rating: from lowest" },
];

export default function ReviewsList({ bookId }) {
  const [sort, setSort] = useState("rating_desc");
  const [isLoading, setIsLoading] = useState(true);
  const { reviews, refreshTrigger, replaceAllReviews } = useReviews();

  const { user } = useUser();
  const userId = user?.id;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const data = await getBookReviews(bookId, userId);

      replaceAllReviews(data);
      setIsLoading(false);
    };
    fetchData();
  }, [bookId, userId, refreshTrigger]);

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sort === "date_desc") {
      return new Date(b.date) - new Date(a.date);
    }
    if (sort === "date_asc") {
      return new Date(a.date) - new Date(b.date);
    }
    if (sort === "rating_desc") {
      return b.review_rating - a.review_rating;
    }
    if (sort === "rating_asc") {
      return a.review_rating - b.review_rating;
    }
    return 0;
  });

  return (
    <div className={styles.reviewsListContainer}>
      <div className={styles.sortSelector}>
        <select
          id="sort"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          {SORT_OPTIONS.map((opt) => (
            <option value={opt.value} key={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {isLoading && (
        <div className={styles.loadingContainer}>
          <ProtectedLoading />
        </div>
      )}
      {!isLoading &&
        sortedReviews?.length > 0 &&
        sortedReviews.map((review) => (
          <Review review={review} key={review.id} />
        ))}
      {!isLoading && sortedReviews && sortedReviews?.length <= 0 && (
        <p className={styles.noItems}>This book has no reviews yet.</p>
      )}
    </div>
  );
}
