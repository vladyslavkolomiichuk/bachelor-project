"use client";

import { getRatingCounts } from "@/lib/db/review";
import RatingSection from "../RatingSection/rating-section";
import ReviewForm from "@/components/FormComponents/ReviewForm/review-form";
import { useEffect, useState } from "react";
import { useReviews } from "@/context/ReviewsContext";
import { useUser } from "@/context/UserContext";

import styles from "./average-rating.module.css";
import { useToast } from "@/context/ToastContext";

export default function AverageRating({ bookId, bookIsbn }) {
  // const [ratingCounts, setRatingCounts] = useState({});
  const [formOpen, setFormOpen] = useState(false);
  const { user } = useUser();

  const { refreshTrigger, ratingCounts, addRatingCounts } = useReviews();

  const { showToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getRatingCounts(bookId);

        addRatingCounts(data);
      } catch {}
    };
    fetchData();
  }, [bookId, refreshTrigger]);

  return (
    <div className={styles.averageRatingContainer}>
      <RatingSection ratingCounts={ratingCounts} />
      <h2 className={styles.title}>Write your Review</h2>
      <p className={styles.helpText}>
        Share your review so people understand what kind of book this is.
      </p>
      <button
        type="button"
        className={styles.addReviewBtn}
        onClick={() => {
          if (!user) {
            showToast("This action requires authorization.", "warning");
            return;
          }
          setFormOpen((prev) => !prev);
        }}
      >
        Write Review
      </button>

      <ReviewForm
        isOpen={formOpen}
        onCancel={() => setFormOpen(false)}
        onDone={() => setFormOpen(false)}
        bookId={bookId}
        bookIsbn={bookIsbn}
      />
    </div>
  );
}
