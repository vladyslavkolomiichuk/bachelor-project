import BookPreviewSkeleton from "./book-preview-skeleton";
import styles from "./colored-book-block-skeleton.module.css";

export default function ColoredBookBlockSkeleton() {
  return (
    <div className={styles.container}>
      <BookPreviewSkeleton />
    </div>
  );
}
