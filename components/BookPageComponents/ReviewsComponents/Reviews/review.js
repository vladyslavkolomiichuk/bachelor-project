import Image from "next/image";
import Rating from "@/components/GeneralComponents/Rating/rating";
import ReviewRating from "../ReviewRating/review-rating";
import { useUser } from "@/context/UserContext";
import { Trash2 } from "lucide-react";
import { useConfirm } from "@/context/ConfirmContext";
import { useReviews } from "@/context/ReviewsContext";
import { useToast } from "@/context/ToastContext";
import { deleteReviewFromDb } from "@/lib/db/review";

import styles from "./reviews.module.css";

export default function Review({ review }) {
  const {
    id: reviewId,
    user_id: reviewUserId,
    image: userImage,
    name,
    surname,
    date: reviewDate,
    book_rating: bookRating,
    review_rating: reviewRating,
    text: reviewText,
    vote_type: userVoteType,
  } = review;

  const { user } = useUser();
  const userId = user?.id;

  const confirm = useConfirm();
  const { showToast } = useToast();

  const { triggerRefresh, deleteReview } = useReviews();

  const handleReviewDelete = async () => {
    const confirmed = await confirm({
      title: "You're about to delete this review",
      message: "This action will completely delete the review.",
      buttonName: "Delete",
    });
    if (!confirmed) return;

    deleteReview(reviewId);

    try {
      await deleteReviewFromDb(reviewId);
    } catch {
      showToast("Error deleting review. Please try again later.", "error");
    } finally {
      triggerRefresh();
    }
  };

  return (
    <div className={styles.reviewContainer}>
      <div className={styles.header}>
        <div className={styles.info}>
          <Image
            className={styles.userImage}
            src={userImage}
            alt={"Picture of the user who wrote the review"}
            width={50}
            height={50}
          />
          <div className={styles.together}>
            <p className={styles.userName}>
              {name} {surname}
            </p>
            <p className={styles.reviewDate}>
              {new Date(reviewDate).toLocaleDateString()}
            </p>
            <Rating rating={bookRating} starColor="#efc44d" />
          </div>
        </div>

        <div className={styles.actions}>
          <ReviewRating
            defaultRating={reviewRating}
            reviewId={reviewId}
            initialVoteStatus={userVoteType}
          />
          {reviewUserId === userId && (
            <button
              type="button"
              className={styles.deleteBtn}
              onClick={handleReviewDelete}
            >
              <Trash2 />
            </button>
          )}
        </div>
      </div>

      <p className={styles.reviewText}>{reviewText}</p>
    </div>
  );
}
