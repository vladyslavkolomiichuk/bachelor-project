import styles from "./rating.module.css";

import { Star } from "lucide-react";
import { StarHalf } from "lucide-react";

export default function Rating({ rating, starColor = "#F2F2F3" }) {
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStars = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5;

    return (
      <>
        <div className={styles.stars}>
          {Array.from({ length: emptyStars }, (_, index) => (
            <Star color={starColor} key={`empty-${index}`} />
          ))}
        </div>
        <div className={`${styles.rating} ${styles.stars}`}>
          {Array.from({ length: fullStars }, (_, index) => (
            <Star fill={starColor} color={starColor} key={`full-${index}`} />
          ))}
          {halfStars > 0 && (
            <StarHalf fill={starColor} color={starColor} key="half" />
          )}
        </div>
      </>
    );
  };

  return <div className={styles.starRating}>{renderStars(rating)}</div>;
}
