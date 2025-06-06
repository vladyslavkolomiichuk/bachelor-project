import shimmerStyles from "../shimmer.module.css";
import styles from "./book-small-preview-skeleton.module.css";

export default function BookSmallPreviewSkeleton() {
  return (
    <div className={styles.bookSmallPreviewSkeleton}>
      <div className={`${styles.skeletonCover} ${shimmerStyles.shimmer}`} />
      <div className={`${styles.skeletonTitle} ${shimmerStyles.shimmer}`} />
    </div>
  );
}
