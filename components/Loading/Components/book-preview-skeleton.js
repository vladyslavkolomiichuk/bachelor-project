import shimmerStyles from "../shimmer.module.css";
import styles from "./book-preview-skeleton.module.css";

export default function BookPreviewSkeleton() {
  return (
    <div className={styles.container}>
      <div className={`${styles.skeletonCover} ${shimmerStyles.shimmer}`} />
      <div className={styles.skeletonInfo}>
        <div className={`${styles.skeletonTitle} ${shimmerStyles.shimmer}`} />
        <div className={`${styles.skeletonAuthor} ${shimmerStyles.shimmer}`} />
        <div className={`${styles.skeletonRating} ${shimmerStyles.shimmer}`} />
        <div
          className={`${styles.skeletonDescription} ${shimmerStyles.shimmer}`}
        />
      </div>
    </div>
  );
}
