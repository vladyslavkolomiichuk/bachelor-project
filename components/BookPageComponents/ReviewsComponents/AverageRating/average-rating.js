import RatingSection from "../RatingSection/rating-section";
import styles from "./average-rating.module.css";

export default function AverageRating({ fullRating }) {
  return (
    <div className={styles.averageRatingContainer}>
      <RatingSection fullRating={fullRating} />
      <div className={styles.review}>
        <h2>Write your Review</h2>
        <p>Share your feedback</p>
        <button>Write Review</button>
      </div>
    </div>
  );
}
