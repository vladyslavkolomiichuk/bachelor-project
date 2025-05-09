import styles from "./book-preview-skeleton.module.css";

export default function BookPreviewSkeleton() {
  return (
    <div className={styles.bookPreviewSkeleton}>
      <div className={styles.skeletonCover} />
      <div className={styles.skeletonInfo}>
        <div className={styles.skeletonTitle} />
        <div className={styles.skeletonAuthor} />
        <div className={styles.skeletonRating} />
        <div className={styles.skeletonDescription} />
      </div>
    </div>
  );
}
