import Rating from "@/components/GeneralComponents/Rating/rating";
import styles from "./rating-section.module.css";

export default function RatingSection({ fullRating }) {
  return (
    <div className={styles.ratingSection}>
      <div className={styles.averageRating}>
        <h2>{fullRating.averageRating}</h2>
        <div className={styles.starRatingContainer}>
          <Rating rating={fullRating.averageRating} starColor="#efc44d" />
          <span className={styles.allReviews}>
            {fullRating.allReviews} ratings
          </span>
        </div>
      </div>
      <div className={styles.detailedRating}>
        <p>5</p>
        <div className={styles.ratingBar}></div>
        <p>90%</p>
        <p>5</p>
        <div className={styles.ratingBar}></div>
        <p>90%</p>
        <p>5</p>
        <div className={styles.ratingBar}></div>
        <p>90%</p>
        <p>5</p>
        <div className={styles.ratingBar}></div>
        <p>90%</p>
        <p>5</p>
        <div className={styles.ratingBar}></div>
        <p>90%</p>
      </div>
    </div>
  );
}
