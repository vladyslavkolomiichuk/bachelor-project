import styles from "./book-small-preview-skeleton.module.css";

export default function BookSmallPreviewSkeleton() {
  return (
    <div className={styles.bookSmallPreviewSkeleton}>
      <div className={styles.skeletonCover} />
      <div className={styles.skeletonTitle} />
    </div>
  );
}