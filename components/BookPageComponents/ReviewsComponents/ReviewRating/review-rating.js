"use client";

import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/context/ToastContext";

import styles from "./review-rating.module.css";
import { useReviews } from "@/context/ReviewsContext";
import { useUser } from "@/context/UserContext";

export default function ReviewRating({
  defaultRating,
  reviewId,
  initialVoteStatus,
}) {
  const [rating, setRating] = useState(defaultRating);
  const [voteStatus, setVoteStatus] = useState(initialVoteStatus);
  const [pending, setPending] = useState(false);

  const { user } = useUser();

  const { showToast } = useToast();

  const { triggerRefresh } = useReviews();

  useEffect(() => {
    setVoteStatus(initialVoteStatus);
  }, [initialVoteStatus]);

  const updateReviewRating = async (id, action) => {
    if (!user) {
      showToast("This action requires authorization.", "warning");
      return;
    }
    if (voteStatus === action) {
      showToast("You already voted this way", "info");
      return;
    }

    const oldRating = rating;
    const oldVoteStatus = voteStatus;

    let ratingChange = 0;
    if (oldVoteStatus === null) {
      ratingChange = action === "upvote" ? 1 : -1;
    } else if (oldVoteStatus !== action) {
      ratingChange = action === "upvote" ? 2 : -2;
    }

    setRating(oldRating + ratingChange);
    setVoteStatus(action);
    setPending(true);

    try {
      const res = await fetch(`/api/reviews/${id}/rating`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      });

      if (!res.ok) {
        throw new Error("Failed to update review rating");
      }

      const data = await res.json();

      setRating(data.rating);
      setVoteStatus(action);
    } catch (error) {
      setRating(oldRating);
      setVoteStatus(oldVoteStatus);
      showToast(error.message || "Failed to update review rating", "error");
    } finally {
      setPending(false);
      triggerRefresh();
    }
  };

  return (
    <div className={styles.reviewRatingContainer}>
      <button
        type="button"
        className={`${styles.voteBtn} ${
          voteStatus === "upvote" ? styles.upVote : ""
        }`}
        onClick={() => {
          updateReviewRating(reviewId, "upvote");
        }}
        disabled={pending}
      >
        <ArrowBigUp />
      </button>

      <p className={styles.rating}>{rating}</p>

      <button
        type="button"
        className={`${styles.voteBtn} ${
          voteStatus === "downvote" ? styles.downVote : ""
        }`}
        onClick={() => {
          updateReviewRating(reviewId, "downvote");
        }}
        disabled={pending}
      >
        <ArrowBigDown />
      </button>
    </div>
  );
}
